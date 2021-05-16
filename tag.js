const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function tag(name, ...children) {
    const result = document.createElement(name);
    for (const child of children) {
        result.appendChild(child);
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

function text(s) {
    return document.createTextNode(s);
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

function blogpost() {
    return div(
        h1(text("1. The Tile")),
        p(text(LOREM)),
        h2(text("1.1. Subtitle")),
        p(text(LOREM)),
        h3(text("1.1.1. Subsubtitle")),
        p(text(LOREM))
    );
}

function jebaited() {
    return div(div(img("jebaited.png")),
               div(img("jebaited.png")),
               div(img("jebaited.png")));
}

function forsen1() {
    return div(img("forsen1.png"),
               img("forsen1.png"),
               img("forsen1.png"));
}

function tabSwitcher(names, choose) {
    return div(
        ...names.map((name, index) => {
            return span(
                a(text(name))
                    .att$("href", "#")
                    .onclick$(() => choose(index))
            ).att$("class", "tab");
        })
    ).att$("class", "tab-switcher");
}

function tabs(ts) {
    const names = Object.keys(ts);
    const tags = names.map(name => ts[name]);

    console.assert(tags.length > 0);

    let currentTab = 0;
    const tabSlot = div(tags[currentTab]);

    return div(
        tabSwitcher(Object.keys(ts), (index) => {
            tabSlot.removeChild(tags[currentTab]);
            tabSlot.appendChild(tags[index]);
            currentTab = index;
        }),
        tabSlot
    );
}

window.onload = () => {
    entry.appendChild(tabs({
        "jebaited": jebaited(),
        "blogpost": blogpost(),
        "forsen1": forsen1(),
        "lorem": div(text(LOREM)),
    }));
}
