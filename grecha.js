const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

let CURRENT_SCOPE;
function createSignal(value) {
  let dependents = new Set;
  return [
    () => {
      if (CURRENT_SCOPE) dependents.add(CURRENT_SCOPE);
      return value;
    },
    update => {
      value = update;
      prev = dependents;
      dependents = new Set();
      for (const f of prev) try { f() } catch (e) { console.error(e) }
    }
  ]
}

function make_node(nodelike) {
  switch (typeof nodelike) {
    case 'function': {
      let node
      CURRENT_SCOPE = function refresh() {
        CURRENT_SCOPE = refresh;
        let update = make_node(nodelike());
        node.parentNode.replaceChild(update, node);
        node = update;
        CURRENT_SCOPE = undefined;
      } 
      node = make_node(nodelike());
      CURRENT_SCOPE = undefined;
      return node
    }
    case 'string':
    case 'number': 
      return document.createTextNode(nodelike)
    default:
      return nodelike
  }
}

function tag(name, ...children) {
  const result = document.createElement(name);
  for (const child of children) 
    result.appendChild(make_node(child))

  result.att$ = function (name, value) {
    this.setAttribute(name, value);
    return this;
  };

  result.onclick$ = function (callback) {
    this.onclick = callback;
    return this;
  };

  return result;
}

const MUNDANE_TAGS = ["canvas", "h1", "h2", "h3", "p", "a", "div", "span", "select", "b"];
for (let tagName of MUNDANE_TAGS) {
  window[tagName] = (...children) => tag(tagName, ...children);
}

function img(src) {
  return tag("img").att$("src", src);
}

function input(type) {
  return tag("input").att$("type", type);
}

function routeSignal() {
  const [route, setRoute] = createSignal();

  function syncHash() {
    setRoute(document.location.hash.split('#')[1] || '/')
  };
  syncHash();
  
  // TODO(#3): there is way to "destroy" an instance of the router to make it remove it's "hashchange" callback
  window.addEventListener("hashchange", syncHash);
  return route;
}
