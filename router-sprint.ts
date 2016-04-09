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
        var sprint:any = await repository.findSprintById(req.params.sprintId);

        var project:any = await repository.findProjectByKey(req.params.projectKey);

        res.render("sprint/resumen", {sprint:sprint, project:project, projectKey: req.params.projectKey
            , sprintId: req.params.sprintId});
    }
    catch(e) {
        next(e);
    }

});
