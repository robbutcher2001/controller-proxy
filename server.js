import express from "express";
import ProtectApi from "./protect-api.js";

const server = "https://192.168.1.1";
const api = new ProtectApi(server);

const app = express();
const port = 3000;

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
