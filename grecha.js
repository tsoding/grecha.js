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

function canvas(...children) {
    return tag("canvas", ...children);
}

function h1(...children) {
    return tag("h1", ...children);
}

function h2(...children) {
    return tag("h2", ...children);
}

function h3(...children) {
    return tag("h3", ...children);
}

function p(...children) {
    return tag("p", ...children);
}

function a(...children) {
    return tag("a", ...children);
}

function div(...children) {
    return tag("div", ...children);
}

function span(...children) {
    return tag("span", ...children);
}

function img(src) {
    return tag("img").att$("src", src);
}

// TODO: the router component should create the pages lazily
function router(routes) {
    let result = div();

    result.syncHash$ = function() {
        let hashLocation = document.location.hash.split('#')[1];
        if (!hashLocation) {
            hashLocation = '/';
        }

        if (!(hashLocation in routes)) {
            // TODO: make the route404 customizable in the router component
            const route404 = '/404';
            console.assert(route404 in routes);
            hashLocation = route404;
        }

        while (this.firstChild) {
            this.removeChild(this.lastChild);
        }
        this.appendChild(routes[hashLocation]);
    };

    return result;
}
