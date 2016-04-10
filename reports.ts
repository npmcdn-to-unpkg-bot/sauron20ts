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

        const project = await repository.findProjectByKey(projectKey);
        let sprint = await repository.findSprintById(sprintId);
        const issues = await repository.findSnapShotIssuesFromSprint(sprintId);

        sprint.totalTareas = 0;
        sprint.totalTareasCompletadas = 0;
        sprint.totalPuntosHistoria = 0;
        sprint.totalPuntosHistoriaCompletados = 0;

        sprint = issues.reduce((sprint,issue) => {
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

        return {
            project:project,
            sprint: sprint
        };
    }

    /**
     * Agrupa los datos del sprint por situación de las tareas
     * @param sprintId
     * @returns {{Detenida: {count: number, sum: number, issues: Array}, Pendiente: {count: number, sum: number, issues: Array}, En curso: {count: number, sum: number, issues: Array}, [Pte. pruebas]: {count: number, sum: number, issues: Array}, Probando: {count: number, sum: number, issues: Array}, Finalizada: {count: number, sum: number, issues: Array}}}
     */
    async situacion(sprintId:number) {

        const issues = await repository.findSnapShotIssuesFromSprint(sprintId);

        let result = {
            "Detenida":{count:0,sum:0,issues:[]},
            "Pendiente":{count:0,sum:0,issues:[]},
            "En curso":{count:0,sum:0,issues:[]},
            "Pte. pruebas":{count:0,sum:0,issues:[]},
            "Probando":{count:0,sum:0,issues:[]},
            "Finalizada":{count:0,sum:0,issues:[]}
        };

        result = issues.reduce((result,issue) => {
            let summary = result[issue.status_situacion];
            checkNotNull("Estado situación",summary);

            summary.count ++;
            summary.sum += issue.puntos_historia;
            summary.issues.push(issue);

            return result;
        },result);

        return result;

    }

}

export const sprintReport = new SprintReport();