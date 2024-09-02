import fetch, { Headers } from "node-fetch";
import https from "https";
import { username, password } from "./config.js";

const method = "POST";
const authPath = "/api/auth/login";
const headers = new Headers({
  "Content-Type": "application/json",
});

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export default class Auth {
  #url;
  #attempts = 0;

  #token;
  #csrf;

  constructor(controller) {
    this.#url = `${controller}${authPath}`;
  }

  login = async () => {
    this.#attempts = this.#attempts + 1;

    const response = await fetch(this.#url, {
      method,
      body: JSON.stringify({
        username,
        password,
      }),
      headers,
      agent,
    });

    if (response.ok) {
      this.#attempts = 0;
      this.#token = response.headers
        .get("set-cookie")
        ?.split(";")[0]
        ?.split("=")[1];
      this.#csrf = response.headers.get("x-csrf-token");
    }

    if (this.#attempts >= 3) {
      throw new Error(`Unsuccessful login after [${this.#attempts}] attempts`);
    }
  };

  getToken = () => this.#token;

  getCsrf = () => this.#csrf;
}
