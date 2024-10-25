export default class Observable {
  #handler = (handler) => ({
    set(target, property, update) {
      handler(update);
      target[property] = update;
      return true;
    },
  });

  build = (value, handler) => new Proxy({ value }, this.#handler(handler));
}
