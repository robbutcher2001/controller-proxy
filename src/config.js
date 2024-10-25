import fs from "node:fs";

export const APP_PORT = 8008;
export const CONTROLLER_URL = process.env.APP_CONTROLLER_URL;
export const CAMERA_ID = process.env.APP_CAMERA_ID;
export const MQTT_BROKER = process.env.APP_MQTT_BROKER;
export const MQTT_PORT = process.env.APP_MQTT_PORT;
export const MQTT_TOPIC = process.env.APP_MQTT_TOPIC;
export const MQTT_MSG_PREFIX = process.env.APP_MQTT_MSG_PREFIX;
export let PROTECT_USERNAME;
export let PROTECT_PASSWORD;
export let MQTT_USERNAME;
export let MQTT_PASSWORD;

try {
  PROTECT_USERNAME = fs
    .readFileSync("/run/secrets/protect_username", "utf8")
    .toString()
    .trim();
  PROTECT_PASSWORD = fs
    .readFileSync("/run/secrets/protect_password", "utf8")
    .toString()
    .trim();
  MQTT_USERNAME = fs
    .readFileSync("/run/secrets/mqtt_username", "utf8")
    .toString()
    .trim();
  MQTT_PASSWORD = fs
    .readFileSync("/run/secrets/mqtt_password", "utf8")
    .toString()
    .trim();
} catch (error) {
  throw error;
}
