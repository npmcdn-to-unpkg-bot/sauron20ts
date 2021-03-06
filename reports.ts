///<reference path='./typings/main.d.ts' />
import {checkNotFound,checkNotNull,logger} from "./util";
import {repository} from "./repository";
import * as Promise from "bluebird";
import * as _ from "underscore";

class SprintReport {

    /**
     * Ficha del sprint
     * @param projectKey
     * @param sprintId
     * @returns {{project: *, sprint: *}}
     */
    async resumenGeneral(projectKey:string, sprintId:number) {

        var results = await Promise.all([
            repository.findProjectByKey(projectKey),
            repository.findSprintById(sprintId),
            repository.findSnapShotIssuesFromSprint(sprintId)
        ]);

        const project:any = results[0];
        let sprint:any = results[1];
        const issues:Array<any> = results[2];

        sprint.totalTareas = 0;
        sprint.totalTareasCompletadas = 0;
        sprint.totalPuntosHistoria = 0;
        sprint.totalPuntosHistoriaCompletados = 0;

        sprint = issues.reduce((sprint:any,issue:any) => {
            sprint.totalTareas ++;
            sprint.totalPuntosHistoria += issue.puntos_historia;
            if(issue.status_completado == 1) {
                sprint.totalTareasCompletadas ++;
                sprint.totalPuntosHistoriaCompletados += issue.puntos_historia;
            }
            return sprint;
        },sprint);

        sprint.percJornadasTranscurridas = Math.round(((sprint.jornadas - sprint.jornadas_pendientes) * 100) / sprint.jornadas);
        sprint.percTotalPuntosHistoriaCompletados = Math.round((sprint.totalPuntosHistoriaCompletados * 100) / sprint.totalPuntosHistoria);

        var chartcols = [
            ['string','Tipo'],
            ['number','% Completado'],
            ['number','% Transcurrido']
        ];

        const chart = {
            cols: [
                ['string','Tipo'],
                ['number','% Completado'],
                ['number','% Transcurrido']
            ],
            rows: [
                ['',sprint.percTotalPuntosHistoriaCompletados, sprint.percJornadasTranscurridas],
                ['',sprint.percTotalPuntosHistoriaCompletados, sprint.percJornadasTranscurridas]
            ],
            config:  {
                title : 'Avance de sprint',
                vAxis: { minValue:0},
                hAxis: { minValue:0, maxValue:100 }
            }
        };

        return {
            project:project,
            sprint: sprint,
            chartInfo: chart
        };
    }

    /**
     * Agrupa los datos del sprint por situación de las tareas
     * @param sprintId
     * @returns {{Detenida: {count: number, sum: number, issues: Array}, Pendiente: {count: number, sum: number, issues: Array}, En curso: {count: number, sum: number, issues: Array}, [Pte. pruebas]: {count: number, sum: number, issues: Array}, Probando: {count: number, sum: number, issues: Array}, Finalizada: {count: number, sum: number, issues: Array}}}
     */
    async situacion(sprintId:number) {

        let issues = await repository.findSnapShotIssuesFromSprint(sprintId);

        issues = await repository.completeIssueInfo(issues);

        let result:any = {
            "Detenida":{count:0,sum:0,issues:[]},
            "Pendiente":{count:0,sum:0,issues:[]},
            "En curso":{count:0,sum:0,issues:[]},
            "Pte. pruebas":{count:0,sum:0,issues:[]},
            "Probando":{count:0,sum:0,issues:[]},
            "Finalizada":{count:0,sum:0,issues:[]}
        };

        return this.resumenDetalle("status_situacion","Situacion","Situación",issues,result);

    }

    async tipo(sprintId:number) {

        let issues = await repository.findSnapShotIssuesFromSprint(sprintId);

        issues = await repository.completeIssueInfo(issues);

        let result:any = {
            "Historia":{count:0,sum:0,issues:[]},
            "Incidencia":{count:0,sum:0,issues:[]}
        };

        return this.resumenDetalle("issuetype_name","Tipo","Tipo",issues,result);

    }


    resumenDetalle(groupByLabel:string,chartTableLabel:string, chartTitle:string,issues:Array<any>,preresult:any) {

        let result:any = issues.reduce((r:any,issue:any) => {
            let summary = r[issue[groupByLabel]];
            if(!summary) {
                r[issue[groupByLabel]] = {count:0,sum:0,issues:[]};
                summary = r[issue[groupByLabel]];
            }

            summary.count ++;
            summary.sum += issue.puntos_historia;
            summary.issues.push(issue);

            return r;
        },preresult || {});

        const chart = {
            cols: [
                ['string',chartTableLabel],
                ['number','Tareas'],
                ['number','Esfuerzo']
            ],
            rows: Object.keys(result).map(key => [key,result[key].count,result[key].sum]),
            config: {
                title : chartTitle }
        };

        return {
            data:result,
            chartInfo: chart
        };

    }


}

export const sprintReport = new SprintReport();