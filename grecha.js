const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const SCOPE_STACK = [];

function createSignal(value) {
  let dependents = new Set;
  let prev = new Set;
  return [
    () => {
      if (SCOPE_STACK.length && !SCOPE_STACK.some(x => dependents.has(x)))
        dependents.add(SCOPE_STACK[SCOPE_STACK.length - 1]);
      return value;
    },
    update => {
      value = update;
      [prev, dependents] = [dependents, prev];
      dependents.clear();
      for (const f of prev) try { f() } catch (e) { console.error(e); }
    }
  ]
}

function make_node(nodelike) {
  switch (typeof nodelike) {
    case 'function': {
      let node
      SCOPE_STACK.push(function refresh() {
        if (node.parentNode) {
            SCOPE_STACK.push(refresh);
            let update;
            try {
              update = make_node(nodelike());
            } finally {
              SCOPE_STACK.pop();
            }
            node.parentNode.replaceChild(update, node);
            node = update;
          } else {
            node = undefined;
          }
      })
      try {
        node = make_node(nodelike());
      } finally{
        SCOPE_STACK.pop();
        return node
      }
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
