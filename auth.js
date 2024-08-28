import fetch, { Headers } from "node-fetch";
import https from "https";

const method = "POST";

const headers = new Headers({
  "Content-Type": "application/json",
});

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const authPath = "/api/auth/login";

// TODO: read in from docker
const body = {
  username: "<set>",
  password: "<set>",
  token: "",
  rememberMe: false,
};

export default class Auth {
  #url;
  #attempts = 0;

  #token;
  #csrf;

  constructor(server) {
    this.#url = `${server}${authPath}`;
  }

  login = async () => {
    this.#attempts = this.#attempts + 1;

    if (this.#attempts >= 3) {
      throw new Error(`Unsuccessful login after [${this.#attempts}] attempts`);
    }

    const response = await fetch(this.#url, {
      method,
      body: JSON.stringify(body),
      headers,
      agent,
    });

    this.#token = response.headers
      .get("set-cookie")
      ?.split(";")[0]
      ?.split("=")[1];
    this.#csrf = response.headers.get("x-csrf-token");
    console.log("Logged in with", this.#token, this.#csrf);
  };

  getToken = () => this.#token;

  getCsrf = () => this.#csrf;
}
