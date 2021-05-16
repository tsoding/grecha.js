const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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

function webglPreview() {
    const PREVIEW_WIDTH = 112;
    const PREVIEW_HEIGHT = 112;
    const previewCanvas = canvas()
          .att$("width", PREVIEW_WIDTH)
          .att$("height", PREVIEW_HEIGHT);
    const gl = previewCanvas.getContext("webgl");

    if (!gl) {
        throw new Error("Could not initialize WebGL context");
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    prepareMeshPositionAttribute(gl);
    prepareShaders(gl)

    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, TRIANGLE_PAIR * TRIANGLE_VERTICIES);

    return div(
        h1(text("Simple WebGL Component")),
        previewCanvas
    )
}

window.onload = () => {
    const app = router({
        "/": div(
            tabs({
                "jebaited": jebaited(),
                "blogpost": blogpost(),
                "forsen1": forsen1(),
                "lorem": div(text(LOREM)),
            }),
            div(
                h2(text("Other Pages")),
                div(a(text("secret page")).att$("href", "#/secret")),
                div(a(text("webgl page")).att$("href", "#/webgl")),
            )
        ),
        "/secret": div(
            p(text("This is a secret page! What are you doing in here!")),
            img("monkaMEGA.png"),
            p(a(text("Back to Home")).att$('href', '#'))
        ),
        "/webgl": div(
            webglPreview(),
            p(a(text("Back to Home")).att$('href', '#'))
        ),
        "/404": div(
            p(text("Path is not found")),
            p(a(text("Back to Home")).att$('href', '#'))
        )
    });

    app.syncHash$();
    window.addEventListener("hashchange", () => {
        app.syncHash$();
    });

    entry.appendChild(app);
}
