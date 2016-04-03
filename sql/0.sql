/* Vista de setalle de cada issue sin hacer join con sprint */
CREATE OR REPLACE VIEW issues AS
  select i.id as id,
         concat(p.pkey,'-',i.issuenum) issuekey,
         i.project project_id,
         p.pkey as project_key,
         p.pname as project_name,
         i.summary as summary,
         i.description as description,
         i.created as created,
         i.updated as updated,
         i.duedate as duedate,
         ur.id as reporter_id,
         ur.user_name as reporter_user_name,
         ur.display_name as reporter_display_name,
         ur.email_address as reporter_email_address,
         assi.id as assignee_id,
         assi.user_name as assignee_user_name,
         assi.display_name as assignee_display_name,
         assi.email_address as assignee_email_address,
         i.issuestatus as status_id,
         status.pname as status_name,
         IF(i.issuestatus = 1 or i.issuestatus = 10200 or i.issuestatus = 10004 or i.issuestatus = 10005,0,1) as status_completado,
         IF(i.issuestatus = 1 or i.issuestatus = 10005,'Pendiente'
         ,IF(i.issuestatus = 10200,'Detenida'
         ,IF(i.issuestatus = 10004,'En curso'
         ,IF(i.issuestatus = 5,'Pte. pruebas'
         ,IF(i.issuestatus = 10001,'Probando'
         ,IF(i.issuestatus is null,null,'Finalizada')))))) as status_situacion,
         i.issuetype as issuetype_id,
         type.pname as issuetype_name,
         i.priority as priority_id,
         pri.pname as priority_name,
         IFNULL(i.timeestimate,0) as timeestimate,
         IFNULL(i.timeoriginalestimate,0) as timeoriginalestimate,
         IFNULL(i.timespent,0) as timespent,
         i.resolutiondate as resolutiondate,
         cf_fechalimite.datevalue fecha_limite,
         cf_fechacab.datevalue fecha_cab,
         cf_planpru.textvalue plan_pruebas,
         cf_planpruvalidacion.textvalue plan_pruebas_validacion,
         cf_obser.textvalue observaciones,
         cf_solucion.textvalue solucion,
         cf_acuerdofun.textvalue acuerdo_funcional,
         cf_planprod.textvalue plan_paso_prod,
         cf_planatras.textvalue plan_marcha_atras,
         FLOOR(IFNULL(cf_puntoshistoria.numbervalue,0)) puntos_historia,
         i_epica.id as epica_id,
         i_epica.summary as epica_summary,
         concat(p.pkey,'-',i_epica.issuenum) as epica_issuekey,
         IF(i_epica.issuestatus = 1 or i_epica.issuestatus = 10200 or i_epica.issuestatus = 10004 or i_epica.issuestatus = 10004,0,1) as epica_status_completado
  from jiradb.jiraissue i
    inner join jiradb.project p ON p.id = i.project
    left join jiradb.cwd_user ur ON ur.user_name = i.reporter
    left join jiradb.cwd_user assi ON assi.user_name = i.assignee
    left join jiradb.priority pri ON pri.id = i.priority
    left join jiradb.issuestatus status ON status.id = i.issuestatus
    left join jiradb.issuetype type ON type.id = i.issuetype
    left join jiradb.resolution re ON re.id = i.resolution
    left join jiradb.customfieldvalue cf_fechalimite ON cf_fechalimite.issue = i.id and cf_fechalimite.customfield = 10742
    left join jiradb.customfieldvalue cf_solucion ON cf_solucion.issue = i.id and cf_solucion.customfield = 10316
    left join jiradb.customfieldvalue cf_acuerdofun ON cf_acuerdofun.issue = i.id and cf_acuerdofun.customfield = 10328
    left join jiradb.customfieldvalue cf_planpru ON cf_planpru.issue = i.id and cf_planpru.customfield = 10329
    left join jiradb.customfieldvalue cf_planpruvalidacion ON cf_planpruvalidacion.issue = i.id and cf_planpruvalidacion.customfield = 10330
    left join jiradb.customfieldvalue cf_obser ON cf_obser.issue = i.id and cf_obser.customfield = 10320
    left join jiradb.customfieldvalue cf_planprod ON cf_planprod.issue = i.id and cf_planprod.customfield = 10322
    left join jiradb.customfieldvalue cf_planatras ON cf_planatras.issue = i.id and cf_planatras.customfield = 10323
    left join jiradb.customfieldvalue cf_puntoshistoria ON cf_puntoshistoria.issue = i.id and cf_puntoshistoria.customfield = 10002
    left join jiradb.customfieldvalue cf_fechacab ON cf_fechacab.issue = i.id and cf_fechacab.customfield = 10743
    left join jiradb.issuelink epica on i.id = epica.destination and epica.linktype = 10200
    left join jiradb.jiraissue i_epica on i_epica.id = epica.source;

CREATE OR REPLACE VIEW comments AS
SELECT ja.id, ja.issueid as issue_id,ja.AUTHOR as author, ja.actionbody as comment, ja.CREATED as created
  , ja.UPDATED as updated , ja.UPDATEAUTHOR as updateauthor
FROM jiradb.jiraaction ja
WHERE ja.actiontype = 'comment';

CREATE OR REPLACE VIEW sprint AS
  select ID as id,NAME as name,RAPID_VIEW_ID as board_id,RAPID_VIEW_ID as rapid_view_id,STARTED as started,
         from_unixtime(START_DATE/1000) as start_date,from_unixtime(END_DATE/1000) as end_date,CLOSED as closed,
         from_unixtime(COMPLETE_DATE/1000) as complete_date from jiradb.AO_60DB71_SPRINT;

CREATE OR REPLACE VIEW issuesprint AS
  select id, issue as issue_id, CAST(stringvalue AS DECIMAL) as sprint_id from jiradb.customfieldvalue where customfield = 10005;


CREATE OR REPLACE VIEW issuestatus AS
  select cg.id as id,
         cg.issueid as issue_id,
         cg.created as status_change_date,
         ci.NEWVALUE as status_change_id,
         ci.NEWSTRING as status_change_name,
         IF(ci.NEWVALUE = 1 or ci.NEWVALUE = 10200 or ci.NEWVALUE = 10004 or ci.NEWVALUE = 10004,0,1) as status_change_completado,
         IF(ci.NEWVALUE = 1 or ci.NEWVALUE = 10005,'Pendiente'
        ,IF(ci.NEWVALUE = 10200,'Detenida'
        ,IF(ci.NEWVALUE = 10004,'En curso'
        ,IF(ci.NEWVALUE = 5,'Pte. pruebas'
        ,IF(ci.NEWVALUE = 10001,'Probando'
        ,IF(ci.NEWVALUE is null,null,'Finalizada')))))) as status_change_situacion,
         ci.OLDVALUE as status_old_id,
         ci.OLDSTRING as status_old_name
  from jiradb.changegroup cg
    inner join jiradb.changeitem ci on ci.groupid = cg.id and ci.field = 'status';

/* Vista Principal que contiene el detalle por cada issue asociada o no a un sprint */
CREATE OR REPLACE VIEW issuedetail AS
  select issue.*,
         sprint.id as sprint_id,
         sprint.name as sprint_name,
         sprint.board_id as sprint_board_id,
         sprint.started as sprint_started,
         sprint.closed as sprint_closed,
         sprint.start_date as sprint_start_date,
         sprint.end_date as sprint_end_date,
         sprint.complete_date as sprint_complete_date
  from issues issue
    left join issuesprint iss on iss.issue_id = issue.id
    left join sprint sprint ON sprint.id = iss.sprint_id;

CREATE OR REPLACE VIEW componentdetail AS
  select component.id as component_id, issuecomponent.issue_id, component.name, component.description, component.lead_id, user.display_name as lead_display_name, user.email_address as lead_email_address, user.user_name as lead_user_name
  from issuecomponent
    left join component ON component.id = issuecomponent.component_id
    left join user ON user.id = component.lead_id;


CREATE OR REPLACE VIEW issuestatusdetail AS
  SELECT cg.created as status_change_date,
    ci.NEWVALUE as status_change_id,
    ci.NEWSTRING as status_change_name,
    IF(ci.NEWVALUE = 1 or ci.NEWVALUE = 10200 or ci.NEWVALUE = 10004 or ci.NEWVALUE = 10004,0,1) as status_change_completado,
    i.*
  FROM issuedetail i
    LEFT JOIN jiradb.changegroup cg ON i.id = cg.issueid
    JOIN jiradb.changeitem ci ON ci.GROUPID = cg.id AND ci.FIELD = 'status';


CREATE OR REPLACE VIEW issueversiondetail AS
  select i.*,
         v.id as version_id,
         v.ARCHIVED as version_archived,
         v.DESCRIPTION as version_description,
         v.RELEASED as version_released,
         v.RELEASEDATE as version_releasedate,
         v.vname as version_name,
         v.STARTDATE as version_startdate
  from jiradb.nodeassociation na
    INNER JOIN jiradb.projectversion v ON v.id = na.SINK_NODE_ID
    INNER JOIN issuedetail_nosprint i ON i.id = na.SOURCE_NODE_ID
  where na.ASSOCIATION_TYPE='IssueFixVersion';



CREATE OR REPLACE VIEW rfcriesgos AS
  select cfv.id, cfv.issue as issue_id, cfo.customvalue as name
  from jiradb.customfieldvalue cfv
    left join jiradb.customfieldoption cfo ON cfo.customfield = cfv.customfield and cfo.id = cfv.stringvalue
  where cfv.customfield = 10318;

CREATE OR REPLACE VIEW issuelink AS
  select id,source as issue_id_padre,DESTINATION issue_id_hijo
  from jiradb.issuelink
  where source in (select id from issue);


CREATE OR REPLACE VIEW status AS
  SELECT id,pname as name from jiradb.issuestatus s;

CREATE OR REPLACE VIEW type AS
  SELECT id,pname as name from jiradb.issuetype;

CREATE OR REPLACE VIEW priority AS
  SELECT id,pname as name from jiradb.priority;


CREATE OR REPLACE VIEW project AS
  select p.id,p.pkey as projectkey,p.pname as name,p.lead as lead, p.lead as responsable
    ,cat.SINK_NODE_ID as projectcategory_id
  from jiradb.project p
    left join jiradb.nodeassociation cat ON (cat.SOURCE_NODE_ID = p.id and
                                             ASSOCIATION_TYPE='ProjectCategory');

CREATE OR REPLACE VIEW component AS
  select c.id as id,
         c.cname as name,
         c.description as description,
         p.id as project_id,
         p.projectkey as project_key,
         p.name as project_name,
         p.lead as project_lead,
         u.id as lead_id,
         u.user_name as lead_user_name,
         u.display_name as lead_display_name,
         u.email_address as lead_email_address
  from jiradb.component c
    LEFT JOIN user u ON c.lead = u.user_name
    JOIN project p on p.id = c.project;

CREATE OR REPLACE VIEW issuecomponent AS
  select na.SOURCE_NODE_ID as issue_id, c.id  as component_id, c.*
  from jiradb.nodeassociation na
 INNER JOIN component c ON c.id = na.SINK_NODE_ID
  where na.ASSOCIATION_TYPE='IssueComponent';

CREATE OR REPLACE VIEW version AS
  select v.id as id,
         v.vname as name,
         v.description as description,
         v.startdate as startdate,
         v.releasedate as releasedate,
         v.released as released,
         v.archived as archived,
         v.url as url,
          p.id as project_id,
          p.projectkey as project_key,
          p.name as project_name,
          p.lead as project_lead
  from jiradb.projectversion v
  JOIN project p on p.id = v.project;


CREATE OR REPLACE VIEW issueversion AS
  select na.SOURCE_NODE_ID as issue_id, v.id  as version_id, v.*
  from jiradb.nodeassociation na
  INNER JOIN version v ON v.id = na.SINK_NODE_ID
  where na.ASSOCIATION_TYPE='IssueFixVersion';

CREATE OR REPLACE VIEW worklog AS
  select w.id as id,
         au.id as author_id,
         aup.id as updateauthor_id,
         worklogbody as comment,
         w.created as created,
         w.updated as updated,
         w.startdate as started,
         IFNULL(w.timeworked,0) as timespentseconds,
         w.issueid as issue_id
  from jiradb.worklog w
    inner join jiradb.cwd_user au ON au.user_name = w.author
    left join jiradb.cwd_user aup ON aup.user_name = w.updateauthor;

CREATE OR REPLACE VIEW scuser AS
  select id,user_name,display_name,email_address from jiradb.cwd_user u
  where u.id in (select ms.child_id from jiradb.cwd_membership ms where ms.parent_id = 10214)
        and u.id <> 10201;

CREATE OR REPLACE VIEW user AS
  select id,user_name,display_name,email_address from jiradb.cwd_user u;

/**
 BEGIN Vista que devuelve la lista de responsables de un componente
 */

CREATE OR REPLACE VIEW groupprojectcomponentleads AS
  select p.projectkey as projectkey,c.lead_id
  from component c
  inner join project p on p.id = c.project_id
  group by p.projectkey,c.lead_id;

CREATE OR REPLACE VIEW componentlead AS
  select clead.projectkey,u.*
  from groupprojectcomponentleads clead
    left join user u on clead.lead_id = u.id
    order by clead.projectkey,u.display_name;

/**
 END Vista que devuelve la lista de responsables de un componente
 */
