///<reference path='./typings/main.d.ts' />
"use strict";

import {logger, database} from "./util";
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

        if(sprint.complete_date != null) {

            //--- Agrupamos la lista de issues de estados cambiados por issue_id y a continuación extraemos de cada agrupación
            //    la primera fila de la lista, ya que al ordenarlo por fecha en orden descendente, ese es el último estado que
            //    la tarea tena en esa fecha.
            //    Finalmente la recorremos y vamos actualizando la lista de issues del sprint con el estado que tenía en la fecha
            //    en que fue completado.

            var aIssuesId: Array<number> = _.map(issues, issue => issue.id);
            var issuesIdx = _.object(_.map(issues, issue => [issue.id, issue]));

            var issuestatuses:Array<any> = await this.findStatusOfIssuesInADate(sprint.complete_date, aIssuesId);

            var issuesChangedIdx = _.chain(issuestatuses).groupBy("issue_id").map((value, key) => value[0]).map((issuestatus:any) => {
                var issue = issuesIdx[issuestatus.issue_id];

                if(issue.issuekey == "SC-420") console.log(issue.issuekey, issue.status_id,issuestatus.status_change_id);

                issue = issue.set("status_id",issuestatus.status_change_id)
                             .set("status_name", issuestatus.status_change_name)
                             .set("status_situacion", issuestatus.status_change_situacion);

                if(issue.issuekey == "SC-420") console.log(issue.issuekey, issue.status_id);

                return issue;
            }).groupBy("id").value();

            issues = _.filter(issues,(issue) => {
                if(issuesChangedIdx.hasOwnProperty(issue.id)) {
                    var iss = issuesChangedIdx[issue.id][0];
                    if(iss.issuekey == "SC-420")  console.log(iss.issuekey, iss.status_id);
                    return issuesChangedIdx[issue.id][0];
                }
                return issue;
            });


        }

        return issues.map(issue => {
            if(issue.issuekey == "SC-420") console.log(Object.assign({key:issue.issuekey,s:issue.status_id}));
            return Object.assign({key:issue.issuekey,s:issue.status_id});
        });
    }

}

export const repository = new Repository();