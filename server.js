import express from "express";
import { CONTROLLER_URL, APP_PORT } from "./src/config.js";
import ProtectApi from "./src/protect-api.js";

const api = new ProtectApi(CONTROLLER_URL);
const app = express();

app.get("/preset/:id", async ({ params }, res, next) => {
  try {
    res.send(await api.presetNavigate(params.id));
  } catch (error) {
    return next(error);
  }
});

app.get("/preset/:id/state", ({ params }, res) => {
  res.send(api.getPresetState(params.id));
});

app.get("/auto-track", async (_, res, next) => {
  try {
    res.send(await api.autoTrack());
  } catch (error) {
    return next(error);
  }
});

app.get("/auto-track/state", (_, res) => {
  res.send(api.getAutoTrackState());
});

app.listen(APP_PORT, () => {
  console.log(`HomeKit Protect proxy running on port ${APP_PORT}`);
});
