///<reference path='./typings/main.d.ts' />
import {logger, database} from "./util";
import * as assert from "assert";
import {IQuery} from "mysql";
import * as Promise from "bluebird";
import * as _ from "underscore";

class Repository {

    /**
     * Retorna las tareas con el estado que tenían antes de una fecha determinada
     * @param fecha
     * @param aIssuesId
     * @returns {Promise<IQuery>}
     */
    findStatusOfIssuesInADate(fecha: Date,aIssuesId: Array<number>) {

        assert.notEqual(fecha,null,"El parámetro de entrada 'fecha' está vacío");
        assert.notEqual(aIssuesId,null,"El parámetro de entrada 'aIssuesId' está vacío");

        return database.query("select * " +
            "from issuestatus i " +
            "where i.issue_id in (?) " +
            "  and i.status_change_date <= ? " +
            "order by i.issue_id,i.status_change_date desc", [aIssuesId,fecha]);
    }

    async findSnapShotIssuesFromSprint(sprintId: number) {

        assert.notEqual(sprintId,null,"El parámetro de entrada  'sprintId' está vacío");

        var sprint = await database.queryForOne("Select * from sprint where id = ?",[sprintId]);

        assert.notEqual(sprint,null,"No se encuentra el sprint para el ID: "+sprintId);

        var issues = await database.query("Select * from issuedetail where sprint_id = ?", [sprintId]);

        if(sprint.complete_date != null) {

            //--- Agrupamos la lista de issues de estados cambiados por issue_id y a continuación extraemos de cada agrupación
            //    la primera fila de la lista, ya que al ordenarlo por fecha en orden descendente, ese es el último estado que
            //    la tarea tenía en esa fecha.
            //    Finalmente la recorremos y vamos actualizando la lista de issues del sprint con el estado que tenía en la fecha
            //    en que fue completado.

            var aIssuesId = issues.map(issue => issue.id);
            var issuesIdx = _.groupBy(issues,issue => issue.id);

            var issuestatuses = await this.findStatusOfIssuesInADate(sprint.complete_date, aIssuesId);
            
            var i = 0;

            issuestatuses.forEach(issuestatus => {
                if(issuesIdx.hasOwnProperty(issuestatus.issue_id)) {
                    var issue:any = issuesIdx[issuestatus.issue_id][0];
                    issue.status_id =  issuestatus.status_change_id;
                    issue.status_name =  issuestatus.status_change_name;
                    issue.status_situacion= issuestatus.status_change_situacion;
                }
            });

        }

        return issues;
    }

}

export const repository = new Repository();