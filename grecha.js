const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function tag(name, ...children) {
    const result = document.createElement(name);
    for (const child of children) {
        if (typeof(child) === 'string') {
            result.appendChild(document.createTextNode(child));
        } else {
            result.appendChild(child);
        }
    }

    result.att$ = function(name, value) {
        this.setAttribute(name, value);
        return this;
    };

    result.onclick$ = function(callback) {
        this.onclick = callback;
        return this;
    };

    return result;
}

const MUNDANE_TAGS = ["canvas", "h1", "h2", "h3", "p", "a", "div", "span", "select"];
for (let tagName of MUNDANE_TAGS) {
    window[tagName] = (...children) => tag(tagName, ...children);
}

const img = (src) => tag("img").att$("src", src);
const input = (type) => tag("input").att$("type", type);

function router(routes) {
    const result = div();

    for (const k in routes)
        routes[k].state = { id: 0 };
    const currentLocation = { value: "/" };
    const state = () => routes[currentLocation.value].state;

    result.refresh = () => {
        state().id = 0;
        let hashLocation = document.location.hash.split('#')[1] || '/';
        if (!(hashLocation in routes)) {
            // TODO(#2): make the route404 customizable in the router component
            const route404 = '/404';
            console.assert(route404 in routes);
            hashLocation = route404;
        }
        currentLocation.value = hashLocation;
        result.replaceChildren(routes[hashLocation](result));
        return result;
    };

    result.useState = (initialValue) => {
        const id = state().id++;
        state()[id] = state()[id] ?? initialValue;
        return [() => state()[id], (v) => {
            state()[id] = v;
            result.refresh();
        }];
    };

    result.refresh(routes);
    // TODO(#3): there is way to "destroy" an instance of the router to make it remove it's "hashchange" callback
    window.addEventListener("hashchange", () => result.refresh(result));
    return result;
}
