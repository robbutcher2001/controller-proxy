const AUTO_TRACK = "AUTO_TRACK";

export default class CameraState {
  #activeState;

  #format = (predicate) => (predicate ? "1" : "0");

  setPresetActive = (id) => (this.#activeState = id);

  setAutoTrackActive = () => (this.#activeState = AUTO_TRACK);

  isPresetActive = (id) => this.#format(this.#activeState === id);

  isAutoTrackActive = () => this.#format(this.#activeState === AUTO_TRACK);
}
