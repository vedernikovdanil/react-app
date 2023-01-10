import { Router } from "express";
import EventEmitter from "events";

const router = Router();

const emitter = new EventEmitter();

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

export default router;
