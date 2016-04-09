///<reference path='./typings/main.d.ts' />
import {logger} from "./util";
import {repository} from "./repository";
import {Router} from "express"

export const router = Router();

router.use('/search', async (req, res, next) => {

    try {
        var sprint = await repository.findSprintById(35);

        res.send(sprint);
    }
    catch(e) {
        next(e);
    }

});


router.use('/result/:projectKey/:sprintId/resumen-general', async (req, res, next) => {

    try {
        var issues = await repository.findSnapShotIssuesFromSprint(req.params.sprintId);

        res.send(issues);
    }
    catch(e) {
        next(e);
    }

});
