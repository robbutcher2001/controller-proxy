import fetch, { Headers } from "node-fetch";
import https from "https";
import { cameraId } from "./config.js";
import Auth from "./auth.js";

const cameraPath = `/proxy/protect/api/cameras/${cameraId}`;
const presetConfig = {
  path: `${cameraPath}/ptz/goto/`,
  options: {
    method: "POST",
  },
};
const autoTrackingConfig = {
  options: {
    method: "PATCH",
    body: JSON.stringify({
      smartDetectSettings: {
        autoTrackingObjectTypes: ["person"],
      },
    }),
  },
};

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export default class ProtectApi {
  #controller;
  #auth;

  constructor(controller) {
    this.#controller = controller;
    this.#auth = new Auth(controller);
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

  presetNavigate = (id) => {
    const { path, options } = presetConfig;
    return this.#request(
      `${this.#controller}${path}${id}`,
      options,
      (data) => data?.success
    );
  };

  autoTrack = () =>
    this.#request(
      `${this.#controller}${cameraPath}`,
      autoTrackingConfig.options,
      (data) =>
        Boolean(data?.smartDetectSettings?.autoTrackingObjectTypes?.length)
    );
}
