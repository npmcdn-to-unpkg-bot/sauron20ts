///<reference path='./typings/main.d.ts' />
import {logger, database} from "./util";
import * as assert from "assert";
import {IQuery} from "mysql";
import * as Promise from "bluebird";
import * as Immutable from "immutable";

class Repository {

    /**
     * Retorna las tareas con el estado que tenían antes de una fecha determinada
     * @param fecha
     * @param aIssuesId
     * @returns {Promise<IQuery>}
     */
    findStatusOfIssuesInADate(fecha: Date,aIssuesId: Immutable.List<number>) {

        assert.notEqual(fecha,null,"El parámetro de entrada 'fecha' está vacío");
        assert.notEqual(aIssuesId,null,"El parámetro de entrada 'aIssuesId' está vacío");

        return database.query("select * " +
            "from issuestatus i " +
            "where i.issue_id in (?) " +
            "  and i.status_change_date <= ? " +
            "order by i.issue_id,i.status_change_date desc", Immutable.List([aIssuesId,fecha]));
    }

    async findSnapShotIssuesFromSprint(sprintId: number) {

        assert.notEqual(sprintId,null,"El parámetro de entrada  'sprintId' está vacío");

        var sprint: Immutable.Map<any,any> = await database.queryForOne("Select * from sprint where id = ?",Immutable.List([sprintId]));

        assert.notEqual(sprint,null,"No se encuentra el sprint para el ID: "+sprintId);

        var issues:Immutable.List<any> = await database.query("Select * from issuedetail where sprint_id = ?", Immutable.List([sprintId]));

        if(sprint.get("complete_date") != null) {

            //--- Agrupamos la lista de issues de estados cambiados por issue_id y a continuación extraemos de cada agrupación
            //    la primera fila de la lista, ya que al ordenarlo por fecha en orden descendente, ese es el último estado que
            //    la tarea tena en esa fecha.
            //    Finalmente la recorremos y vamos actualizando la lista de issues del sprint con el estado que tenía en la fecha
            //    en que fue completado.

            var aIssuesId = issues.map(issue => issue.get("id")).toList();
            var issuesIdx = issues.groupBy(issue => issue.get("id"));

            var issuestatuses:Immutable.List<any> = await this.findStatusOfIssuesInADate(sprint.get("complete_date"), aIssuesId);
            
            var i = 0;

            var issuesChangedIdx = issuestatuses.groupBy(issuestatus => issuestatus.get("issue_id")).map((value, key) => value.get(0)).map(issuestatus => {
                var arrissue = issuesIdx.get(issuestatus.get("issue_id"));
                if(arrissue) {
                    var issue = arrissue.get(0);
                    var idx = issues.indexOf(issue);
                    if(idx == -1) throw new Error("No se encuentra en la lista la tarea con el ID: " + issue.get("issuekey"));
                    issue = issue.set("status_id", issuestatus.get("status_change_id"))
                         .set("status_name",  issuestatus.get("status_change_name"))
                         .set("status_situacion",issuestatus.get("status_change_situacion"));
                    issues = issues.set(idx,issue);
                }
            });
        }

        return issues;
    }

}

export const repository = new Repository();