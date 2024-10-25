import { connect } from "mqtt";
import {
  MQTT_BROKER,
  MQTT_PORT,
  MQTT_TOPIC,
  MQTT_MSG_PREFIX,
  MQTT_USERNAME as username,
  MQTT_PASSWORD as password,
} from "./config.js";

export default class EventEmitter {
  static #protocol = "mqtt";
  static #host = MQTT_BROKER;
  static #port = MQTT_PORT;
  static #topic = MQTT_TOPIC;
  static #prefix = MQTT_MSG_PREFIX;
  static #url = `${this.#protocol}://${this.#host}:${this.#port}`;

  static #client;

  static {
    this.#client = connect(this.#url, {
      username,
      password,
    });

    this.#client.on("error", (err) => {
      console.error(err);
    });
  }

  static publish = (message) => {
    this.#client.publish(
      this.#topic,
      `${this.#prefix}${message?.toLowerCase()}`,
      { qos: 1 },
      (err) => {
        if (err) console.error(err);
      }
    );
  };
}
