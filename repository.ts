///<reference path='./typings/main.d.ts' />

import {logger} from "./util-logger";
import {database} from "./util-database";
import * as assert from "assert";
import * as _ from "underscore";
import {IQuery} from "mysql";
import * as Promise from "bluebird";

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

        var sprint: any = await database.queryForOne("Select * from sprint where id = ?",[sprintId]);

        assert.notEqual(sprint,null,"No se encuentra el sprint para el ID: "+sprintId);

        var issues:Array<any> = await database.query("Select * from issuedetail where sprint_id = ?", [sprintId]);

        var aIssuesId: Array<number> = _.map(issues, issue => issue.id);

        if(sprint.complete_date != null) {

            //--- Agrupamos la lista de issues de estados cambiados por issue_id y a continuación extraemos de cada agrupación
            //    la primera fila de la lista, ya que al ordenarlo por fecha en orden descendente, ese es el último estado que
            //    la tarea tena en esa fecha.
            //    Finalmente la recorremos y vamos actualizando la lista de issues del sprint con el estado que tenía en la fecha
            //    en que fue completado.

            var issuesIdx = _.object(_.map(issues, issue => [issue.id, issue]));

            var issuestatuses:Array<any> = await this.findStatusOfIssuesInADate(sprint.complete_date, aIssuesId);

            _.chain(issuestatuses).groupBy("issue_id").map((value, key) => value[0]).each((issuestatus:any) => {
                var issue = issuesIdx[issuestatus.issue_id];
                issue.status_id = issuestatus.status_change_id;
                issue.status_name = issuestatus.status_change_name;
                issue.status_situacion = issuestatus.status_change_situacion;
            });

        }

        return issues;
    }

}

export const repository = new Repository();