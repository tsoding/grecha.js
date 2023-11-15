class Example {
  constructor() {
    this.asd = ''

    this.methods = {
      att$(name, value) {
        this.element.setAttribute(name, value);
        return this;
      },

      onclick$(callback) {
        this.element.onclick = callback;
        return this;
      },

      get$() {
        return this.element;
      }
    }
  }
}

let element = document.createElement("div");

let core = new Example();

Object.assign(core, core.methods),
Object.assign(element, core.methods)

console.log(
  // Object.getOwnPropertyNames(core.__proto__)
  Object.getOwnPropertyNames(core),
  Object.getOwnPropertyNames(element)
)