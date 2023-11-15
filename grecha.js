const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

class ElementWrapper {

  /* We create attractive class. */

  constructor(name, ...children) {
    this.element = document.createElement(name)

    let methods = this.methods();

    Object.assign(this, methods);
    Object.assign(this.element, methods);

    for (const child of children) {
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
}

const MUNDANE_TAGS = ["canvas", "h1", "h2", "h3", "p", "a", "div", "span", "select"];
for (const tagName of MUNDANE_TAGS) {
  window[tagName] = (...children) => new ElementWrapper(tagName, ...children).get$();
}

function img(src) {
  return new ElementWrapper("img").att$("src", src).get$();
}

function input(type) {
  return new ElementWrapper("input").att$("type", type).get$();
}

function router(routes) {
  const resultWrapper = new ElementWrapper("div");
  const result = resultWrapper.get$();

  let methods = {
    syncHash() {
      let hashLocation = document.location.hash.split('#')[1] || '/';
      const route404 = '/404';

      if (!(hashLocation in routes)) {
        console.assert(route404 in routes, `Route "${route404}" not found among the routes.`);
        hashLocation = route404;
      }

      result.replaceChildren(routes[hashLocation]());
    },

    destroy() {
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
}