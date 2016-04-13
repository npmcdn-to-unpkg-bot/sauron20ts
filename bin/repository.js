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
const Promise = require("bluebird");
const _ = require("underscore");
class Repository {
    findComponentsOfIssues(aIssuesId) {
        util_1.checkNotNull("aIssuesId", aIssuesId);
        return util_1.database.query("select * from issuecomponent where issue_id in(?)", [aIssuesId]);
    }
    findVersionsOfIssues(aIssuesId) {
        util_1.checkNotNull("aIssuesId", aIssuesId);
        return util_1.database.query("select * from issueversion where issue_id in(?)", [aIssuesId]);
    }
    findProjectByKey(projectKey) {
        util_1.checkNotNull("projectKey", projectKey);
        return util_1.database.queryForOne("Select * from project where projectkey = ?", [projectKey]);
    }
    findSprintById(sprintId) {
        util_1.checkNotNull("sprintId", sprintId);
        return util_1.database.queryForOne("select *, " +
            "5 * (DATEDIFF(end_date, NOW()) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * NOW() + WEEKDAY(end_date) + 1, 1) as jornadas_pendientes," +
            "5 * (DATEDIFF(end_date, start_date) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * WEEKDAY(start_date) + WEEKDAY(end_date) + 1, 1) as jornadas " +
            " from sprint " +
            "where id = ?", [sprintId, sprintId, sprintId, sprintId, sprintId]).then(sprint => {
            if (sprint.jornadas_pendientes < 0) {
                sprint.jornadas_pendientes = 0;
            }
            return sprint;
        });
    }
    findStatusOfIssuesInADate(fecha, aIssuesId) {
        util_1.checkNotNull("fecha", fecha);
        util_1.checkNotNull("aIssuesId", aIssuesId);
        return util_1.database.query("select * " +
            "from issuestatus i " +
            "where i.issue_id in (?) " +
            "  and i.status_change_date <= ? " +
            "order by i.issue_id,i.status_change_date desc", [aIssuesId, fecha]);
    }
    findSnapShotIssuesFromSprint(sprintId) {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.checkNotNull("sprintId", sprintId);
            const sprint = yield util_1.database.queryForOne("Select * from sprint where id = ?", [sprintId]);
            util_1.checkNotFound("sprint", sprint, sprintId);
            var issues = yield util_1.database.query("Select * from issuedetail where sprint_id = ?", [sprintId]);
            if (sprint.complete_date != null) {
                var aIssuesId = issues.map(issue => issue.id);
                var issuesIdx = _.groupBy(issues, issue => issue.id);
                var issuestatuses = yield this.findStatusOfIssuesInADate(sprint.complete_date, aIssuesId);
                issuestatuses = _.chain(issuestatuses).groupBy("issue_id").map((value, key) => value[0]).value();
                var i = 0;
                issuestatuses.forEach((issuestatus) => {
                    if (issuesIdx.hasOwnProperty(issuestatus.issue_id)) {
                        var issue = issuesIdx[issuestatus.issue_id][0];
                        issue.status_id = issuestatus.status_change_id;
                        issue.status_name = issuestatus.status_change_name;
                        issue.status_situacion = issuestatus.status_change_situacion;
                    }
                });
            }
            return issues;
        });
    }
    completeIssueInfo(issues) {
        return __awaiter(this, void 0, void 0, function* () {
            if (issues == null || issues.length == 0)
                return issues;
            const aIssuesId = issues.map(issue => issue.id);
            const data = yield Promise.all([
                this.findComponentsOfIssues(aIssuesId),
                this.findVersionsOfIssues(aIssuesId)
            ]);
            var componentsIdx = _.groupBy(data[0], "issue_id");
            var versionsIdx = _.groupBy(data[1], "issue_id");
            issues.forEach((issue) => {
                issue.components = componentsIdx[issue.id] ? componentsIdx[issue.id] : [];
                issue.versions = versionsIdx[issue.id] ? versionsIdx[issue.id] : [];
            });
            return issues;
        });
    }
}
exports.repository = new Repository();
