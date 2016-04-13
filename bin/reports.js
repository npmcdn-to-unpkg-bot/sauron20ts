"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const util_1 = require("./util");
const repository_1 = require("./repository");
const Promise = require("bluebird");
class SprintReport {
    resumenGeneral(projectKey, sprintId) {
        return __awaiter(this, void 0, void 0, function* () {
            var results = yield Promise.all([
                repository_1.repository.findProjectByKey(projectKey),
                repository_1.repository.findSprintById(sprintId),
                repository_1.repository.findSnapShotIssuesFromSprint(sprintId)
            ]);
            const project = results[0];
            let sprint = results[1];
            const issues = results[2];
            sprint.totalTareas = 0;
            sprint.totalTareasCompletadas = 0;
            sprint.totalPuntosHistoria = 0;
            sprint.totalPuntosHistoriaCompletados = 0;
            sprint = issues.reduce((sprint, issue) => {
                sprint.totalTareas++;
                sprint.totalPuntosHistoria += issue.puntos_historia;
                if (issue.status_completado == 1) {
                    sprint.totalTareasCompletadas++;
                    sprint.totalPuntosHistoriaCompletados += issue.puntos_historia;
                }
                return sprint;
            }, sprint);
            sprint.percJornadasTranscurridas = Math.round(((sprint.jornadas - sprint.jornadas_pendientes) * 100) / sprint.jornadas);
            sprint.percTotalPuntosHistoriaCompletados = Math.round((sprint.totalPuntosHistoriaCompletados * 100) / sprint.totalPuntosHistoria);
            var chartcols = [
                ['string', 'Tipo'],
                ['number', '% Completado'],
                ['number', '% Transcurrido']
            ];
            const chart = {
                cols: [
                    ['string', 'Tipo'],
                    ['number', '% Completado'],
                    ['number', '% Transcurrido']
                ],
                rows: [
                    ['', sprint.percTotalPuntosHistoriaCompletados, sprint.percJornadasTranscurridas],
                    ['', sprint.percTotalPuntosHistoriaCompletados, sprint.percJornadasTranscurridas]
                ],
                config: {
                    title: 'Avance de sprint',
                    vAxis: { minValue: 0 },
                    hAxis: { minValue: 0, maxValue: 100 }
                }
            };
            return {
                project: project,
                sprint: sprint,
                chartInfo: chart
            };
        });
    }
    situacion(sprintId) {
        return __awaiter(this, void 0, void 0, function* () {
            let issues = yield repository_1.repository.findSnapShotIssuesFromSprint(sprintId);
            issues = yield repository_1.repository.completeIssueInfo(issues);
            let result = {
                "Detenida": { count: 0, sum: 0, issues: [] },
                "Pendiente": { count: 0, sum: 0, issues: [] },
                "En curso": { count: 0, sum: 0, issues: [] },
                "Pte. pruebas": { count: 0, sum: 0, issues: [] },
                "Probando": { count: 0, sum: 0, issues: [] },
                "Finalizada": { count: 0, sum: 0, issues: [] }
            };
            result = issues.reduce((r, issue) => {
                let summary = r[issue.status_situacion];
                util_1.checkNotNull("Estado situación", summary);
                summary.count++;
                summary.sum += issue.puntos_historia;
                summary.issues.push(issue);
                return r;
            }, result);
            const chart = {
                cols: [
                    ['string', 'Situación'],
                    ['number', 'Tareas'],
                    ['number', 'Esfuerzo']
                ],
                rows: Object.keys(result).map(key => [key, result[key].count, result[key].sum]),
                config: {
                    title: 'Avance de sprint' }
            };
            return {
                data: result,
                chartInfo: chart
            };
        });
    }
}
exports.sprintReport = new SprintReport();
