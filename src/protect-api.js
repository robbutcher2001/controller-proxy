import fetch, { Headers } from "node-fetch";
import https from "https";
import { CAMERA_ID } from "./config.js";
import Auth from "./auth.js";
import CameraState from "./camera-state.js";

const cameraPath = `/proxy/protect/api/cameras/${CAMERA_ID}`;
const presetConfig = {
  path: `${cameraPath}/ptz/goto/`,
  options: {
    method: "POST",
  },
};
const autoTrackingConfig = ({ switchOn }) => ({
  options: {
    method: "PATCH",
    body: JSON.stringify({
      smartDetectSettings: {
        autoTrackingObjectTypes: switchOn ? ["person"] : [],
      },
    }),
  },
});
const autoTrackingOnConfig = autoTrackingConfig({ switchOn: true });
const autoTrackingOffConfig = autoTrackingConfig({ switchOn: false });

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export default class ProtectApi {
  #controller;
  #auth;
  #state;

  constructor(controller) {
    this.#controller = controller;
    this.#auth = new Auth(controller);
    this.#state = new CameraState();
  }

  #request = async (url, options, handler) => {
    const headers = new Headers({
      Cookie: `token=${this.#auth.getToken()}`,
      "X-Csrf-Token": this.#auth.getCsrf(),
    });

    if (options.body) {
      headers.append("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      agent,
      headers,
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        await this.#auth.login();
        return this.#request(url, options, handler);
      }

      throw new Error(`Response failed with code [${response.status}]`);
    }

    return handler(await response.json());
  };

  presetNavigate = async (id) => {
    const autoTrackOff = await this.#request(
      `${this.#controller}${cameraPath}`,
      autoTrackingOffConfig.options,
      (data) => data?.smartDetectSettings?.autoTrackingObjectTypes?.length === 0
    );

    const presetOn = await this.#request(
      `${this.#controller}${presetConfig.path}${id}`,
      presetConfig.options,
      (data) => Boolean(data?.success)
    );

    this.#state.setPresetActive(id);

    return autoTrackOff && presetOn;
  };

  autoTrack = async () => {
    const autoTrackOn = await this.#request(
      `${this.#controller}${cameraPath}`,
      autoTrackingOnConfig.options,
      (data) => data?.smartDetectSettings?.autoTrackingObjectTypes?.length > 0
    );

    this.#state.setAutoTrackActive();

    return autoTrackOn;
  };

  getPresetState = (id) => this.#state.isPresetActive(id);

  getAutoTrackState = () => this.#state.isAutoTrackActive();
}
