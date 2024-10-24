import fs from "node:fs";

export const port = 8008;

export const controller = "https://192.168.1.1";
export const cameraId = "66c7894000f99803e40129d4";
export let username;
export let password;

try {
  username = fs.readFileSync("/run/secrets/username", "utf8").toString().trim();
  password = fs.readFileSync("/run/secrets/password", "utf8").toString().trim();
} catch (error) {
  throw error;
}
