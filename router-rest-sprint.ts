///<reference path='./typings/main.d.ts' />
import {logger} from "./util";
import {repository} from "./repository";
import {Router} from "express";

export const router = Router();


router.use('/:sprintId/issues', async (req, res, next) => {

    try {
        res.send(await repository.findSnapShotIssuesFromSprint(req.params.sprintId));
    }
    catch(e) {
        next(e);
    }

});


router.use('/:sprintId', async (req, res, next) => {

    try {
        res.send(await repository.findSprintById(req.params.sprintId));
    }
    catch(e) {
        next(e);
    }

});


