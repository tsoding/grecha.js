import ElementWrapper from './src/elementWrapper.js';
import tag from './tag.js';
import globalMethods from './src/globalMethods.js';

class Grecha {
  static ElementWrapper = ElementWrapper;
  static gm = globalMethods;
  static tag = tag;

  constructor(window) {
    let g_ = this;

    this.ElementWrapper = ElementWrapper;
    this.tag = tag;
    this.gm = globalMethods;

    // @ Tag-init for basic wrapping tags
    const MUNDANE_TAGS = [
      "canvas",

      "h1",
      "h2",
      "h3",

      "p",
      "a",

      "div",
      "span",

      "html",
      "head",
      "body",
    ];

    for (const tagName of MUNDANE_TAGS) {
      window[tagName] = (...children) => tag(tagName, ...children);
    }
    // ---

    // @ Class Exports
    if (typeof module == 'undefined') {
      Object.assign(window, this.gm);
    }

  }
}

// @ Module Exports
if (globalThis?.window) {

  window.Grecha = Grecha;
  window.Susha = new Grecha(window)

} else {

  globalThis?.module?.exports
    ? module.exports.Grecha = Susha
    : false;

  globalThis?.module?.exports
    ? module.exports.Susha = new Grecha(globalThis)
    : false;
}

export default Susha;