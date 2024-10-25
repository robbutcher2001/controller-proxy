import EventEmitter from "./event-emitter.js";
import Observable from "./observable.js";

const AUTO_TRACK = "AUTO_TRACK";

export default class CameraState {
  #active;

  constructor() {
    this.#active = new Observable().build(this.#active, EventEmitter.publish);
  }

  #format = (predicate) => (predicate ? "1" : "0");

  setPresetActive = (id) => (this.#active.value = id);

  setAutoTrackActive = () => (this.#active.value = AUTO_TRACK);

  isPresetActive = (id) => this.#format(this.#active.value === id);

  isAutoTrackActive = () => this.#format(this.#active.value === AUTO_TRACK);
}
