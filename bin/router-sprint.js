"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const reports_1 = require("./reports");
const express_1 = require("express");
exports.router = express_1.Router();
exports.router.use('/search', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        throw new Error("Not implemented");
    }
    catch (e) {
        next(e);
    }
}));
exports.router.use('/result/:projectKey/:sprintId/resumen-general', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        var reportResult = yield reports_1.sprintReport.resumenGeneral(req.params.projectKey, req.params.sprintId);
        res.render("sprint/resumen", Object.assign(reportResult, { projectKey: req.params.projectKey,
            sprintId: req.params.sprintId }));
    }
    catch (e) {
        next(e);
    }
}));
exports.router.use('/result/:projectKey/:sprintId/situacion', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        var reportResult = yield reports_1.sprintReport.situacion(req.params.sprintId);
        res.render("sprint/situacion", Object.assign(reportResult, { projectKey: req.params.projectKey,
            sprintId: req.params.sprintId }));
    }
    catch (e) {
        next(e);
    }
}));
exports.router.use('/rest/result/:projectKey/:sprintId/resumen', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        var reportResult = yield reports_1.sprintReport.resumenGeneral(req.params.projectKey, req.params.sprintId);
        res.send(Object.assign(reportResult, { projectKey: req.params.projectKey,
            sprintId: req.params.sprintId }));
    }
    catch (e) {
        next(e);
    }
}));
exports.router.use('/rest/result/:projectKey/:sprintId/situacion', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        var reportResult = yield reports_1.sprintReport.situacion(req.params.sprintId);
        res.send(Object.assign(reportResult, { projectKey: req.params.projectKey,
            sprintId: req.params.sprintId }));
    }
    catch (e) {
        next(e);
    }
}));
