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

const MUNDANE_TAGS = ["canvas", "h1", "h2", "h3", "p", "a", "div", "span"];
for (let tagName of MUNDANE_TAGS) {
    window[tagName] = (...children) => tag(tagName, ...children);
}

function img(src) {
    return tag("img").att$("src", src);
}

// TODO(#1): the router component should create the pages lazily
function router(routes) {
    let result = div();

    function syncHash() {
        let hashLocation = document.location.hash.split('#')[1];
        if (!hashLocation) {
            hashLocation = '/';
        }

        if (!(hashLocation in routes)) {
            // TODO(#2): make the route404 customizable in the router component
            const route404 = '/404';
            console.assert(route404 in routes);
            hashLocation = route404;
        }

        while (result.firstChild) {
            result.removeChild(result.lastChild);
        }
        result.appendChild(routes[hashLocation]);

        return result;
    };

    syncHash();
    // TODO: there is way to "destroy" an instance of the router to make it remove it's "hashchange" callback
    window.addEventListener("hashchange", syncHash);

    return result;
}
