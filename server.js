import express from "express";
import { controller, port } from "./config.js";
import ProtectApi from "./protect-api.js";

const api = new ProtectApi(controller);
const app = express();

app.get("/preset/:id", async ({ params }, res, next) => {
  try {
    res.send(await api.presetNavigate(params.id));
  } catch (error) {
    return next(error);
  }
});

app.get("/auto-track", async (_, res, next) => {
  try {
    res.send(await api.autoTrack());
  } catch (error) {
    return next(error);
  }
});

app.listen(port, () => {
  console.log(`HomeKit Protect proxy running on port ${port}`);
});
