"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_1 = __importDefault(require("events"));
const router = (0, express_1.Router)();
const emitter = new events_1.default();
let lightData = {
    light: false,
};
lightData = new Proxy(lightData, {
    set(target, prop, newValue, receiver) {
        const res = Reflect.set(target, prop, newValue, receiver);
        emitter.emit("update", target);
        return res;
    },
});
router.get("/test", (req, res) => {
    res.status(200).send(lightData);
});
router.post("/test", (req, res) => {
    lightData.light = req.body.light;
    res.status(200).send(lightData);
});
router.post("/test/subscribe", (req, res) => {
    emitter.once("update", (data) => {
        res.status(200).send(data);
    });
});
exports.default = router;
