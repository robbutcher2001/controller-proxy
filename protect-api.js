import fetch, { Headers } from "node-fetch";
import https from "https";
import Auth from "./auth.js";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

// TODO: id read in from docker?
const cameraPath = "/proxy/protect/api/cameras/66c7894000f99803e40129d4";

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

export default class ProtectApi {
  #server;
  #auth;

  constructor(server) {
    this.#server = server;
    this.#auth = new Auth(server);
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
        console.log("UNAUTHORISED");
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
      `${this.#server}${path}${id}`,
      options,
      (data) => data?.success
    );
  };

  autoTrack = () =>
    this.#request(
      `${this.#server}${cameraPath}`,
      autoTrackingConfig.options,
      (data) =>
        Boolean(data?.smartDetectSettings?.autoTrackingObjectTypes?.length)
    );
}
