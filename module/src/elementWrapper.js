import Methods from "./ElementWMethods.js";

class ElementWrapper {

  static LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  static _lorem_ = function() {
    window.LOREM = ElementWrapper.LOREM;
  }()

  static RouterSymbol = Symbol.for("grecha-router");
  static CoreSymbol = Symbol.for("grecha-core");

  /* We create attractive class. */

  constructor(name, ...children) {
    if (typeof name === "string") {
      this.element = document.createElement(name);

    } else {
      this.element = name;
    }

    let methods = this._m = this.methods();

    Object.assign(this, methods);
    Object.assign(this.element, methods);

    if (children) for (const child of children) {
      if (typeof child === 'string') {
        this.element.appendChild(document.createTextNode(child));
      } else if (child instanceof ElementWrapper) {
        this.element.appendChild(child.element);
      } else {
        this.element.appendChild(child);
      }
    }
  }

  methods() {
    return Methods(this, ElementWrapper)
  }

  _changeElement(el) {
    this.element = el;

    this._applyMethods();

    return this;
  }

  _applyMethods() {
    Object.assign(this.element, this.methods);
  }
}

export default ElementWrapper;