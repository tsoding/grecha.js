class Grecha {
  constructor(window) {
    class ElementWrapper {

      static LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

      static _lorem_ = function() {
        window.LOREM = ElementWrapper.LOREM;
      }()

      /* We create attractive class. */

      constructor(name, ...children) {
        this.element = document.createElement(name)

        let methods = this.methods();

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
        let cw = this
        return {

          __LOREM__() { return ElementWrapper.LOREM },
          get LOREM() { return this.__LOREM__() },

          att$(name, value) {
            cw.element.setAttribute(name, value);
            return cw;
          },

          onclick$(callback) {
            cw.element.onclick = callback;
            return cw;
          },

          get$() {
            return cw.element;
          },

          wrapper$() {
            return cw;
          }

        }
      }

      _changeElement(el) {
        this.element = el;

        this._applyMethods();

        return this;
      }

      _applyMethods() {
        Object.assign(this.element, methods);
      }
    }

    // @ Tag-init for basic wrapping tags
    const MUNDANE_TAGS = ["canvas", "h1", "h2", "h3", "p", "a", "div", "span", "select"];

    for (const tagName of MUNDANE_TAGS) {
      window[tagName] = (...children) => new ElementWrapper(tagName, ...children).get$();
    }
    // ---

    // @ Tagware
    const windowMethods = {

      // @ Basic
      img(src) {
        return new ElementWrapper("img").att$("src", src).get$();
      },

      input(type) {
        return new ElementWrapper("input").att$("type", type).get$();
      },

      button(text) {
        return new ElementWrapper("button").att$("text", text).get$();
      },

      select(...options) {
        let select = new ElementWrapper("select").get$();
        for (const option of options) {
          select.appendChild(new ElementWrapper("option").att$("value", option).get$());
        }
        return select;
      },

      // @ Router
      router(routes) {
        const resultWrapper = new ElementWrapper("div");
        const result = resultWrapper.get$();

        const GR_SYM = Symbol.for("grecha-router")

        window[GR_SYM] = resultWrapper;

        let methods = {

          get __handler__() { return window[GR_SYM] },

          syncHash() {
            const url = new URL(window.location);
            let hashLocation = url.hash.slice(1) || '/';
            const route404 = '/404';

            if (!(hashLocation in routes)) {
              console.assert(route404 in routes, `Route "${route404}" not found among the routes.`);
              hashLocation = route404;
            }

            result.replaceChildren(routes[hashLocation]());
          },

          destroyGrechaSync() {
            window.removeEventListener("hashchange", methods.syncHash);
          }
        }

        window.addEventListener("hashchange", methods.syncHash);

        Object.assign(result, methods);

        // @ Some simplification/quality of life changes. 
        result.refresh = result.syncHash;
        // ---

        methods.syncHash();

        return result;
      },

    }
    // ---
    
    // @ Class Exports
    if (typeof module !== 'undefined') {
      module.exports = windowMethods;
    } else {
      Object.assign(window, windowMethods);
    }
    
  }
}

// @ Module Exports
if (typeof module !== 'undefined') {
  module.exports = Grecha;
} else {
  window.__Grecha__ = Grecha;
  new Grecha(window);
}