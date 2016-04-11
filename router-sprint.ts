///<reference path='./typings/main.d.ts' />
import {logger} from "./util";
import {sprintReport} from "./reports";
import {Router} from "express"

export const router = Router();

router.use('/search', async (req, res, next) => {

    try {
        throw new Error("Not implemented");
    }
    catch(e) {
        next(e);
    }

});

/**
 * Resumen general
 */
router.use('/result/:projectKey/:sprintId/resumen-general', async (req, res, next) => {

    try {
        var reportResult:any = await sprintReport.resumenGeneral(req.params.projectKey, req.params.sprintId);

        res.render("sprint/resumen", Object.assign(reportResult, { projectKey: req.params.projectKey
            , sprintId: req.params.sprintId}));
    }
    catch(e) {
        next(e);
    }

});

/**
 * Por situación
 */
router.use('/result/:projectKey/:sprintId/situacion', async (req, res, next) => {

    try {
        var reportResult:any = await sprintReport.situacion(req.params.sprintId);
        res.render("sprint/situacion", Object.assign(reportResult, { projectKey: req.params.projectKey
            , sprintId: req.params.sprintId}));
    }
    catch(e) {
        next(e);
    }

});

router.use('/rest/result/:projectKey/:sprintId/situacion', async (req, res, next) => {

    try {
        var reportResult:any = await sprintReport.situacion(req.params.sprintId);
        res.send(Object.assign(reportResult, { projectKey: req.params.projectKey
            , sprintId: req.params.sprintId}));
    }
    catch(e) {
        next(e);
    }

});
