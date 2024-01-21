# Grecha.js

![KashaHard](KashaHard.gif)

Simple Front-End JavaScript Framework. Originally designed for [emoteJAM](https://github.com/tsoding/emoteJAM). The name basically means [buckwheat](https://en.wikipedia.org/wiki/Buckwheat) in russian.

## Quick Start

https://tsoding.github.io/grecha.js/example.html

```html
<!DOCTYPE html>
<html>
  <head><title>Grecha.js</title></head>
  <body>
    <div id="entry"></div>
    <script src="./grecha.js"></script>
    <script>
      const kasha = img("Kasha.png");
      const kashaHard = img("KashaHard.gif");

      const [count, setCount] = createSignal(0);
      const squared = () => count() * count();
      const [hard, setHard] = createSignal(false);

      const route = routeSignal();

      const r = div(() => ({
          "/": () => div(
            h1("Grecha.js"),
            div(a("Foo (new content here!)").att$("href", "#/foo")),
            div(a("Bar").att$("href", "#/bar")),
            div("Counter: ", count),
            div(() => hard() ? kashaHard : kasha).onclick$(() => {
              setCount(count() + !hard());
              setHard(!hard());
            }),
          ),
          "/foo": () => div(
            h1("Foo"),
            () => {
              // Wow, scoping!
              const [count, setCount] = createSignal(-7);
              return div("This one resets when you leave the page, automagically: ", b(count)).onclick$(() => setCount(count() + 1));
            },
            p(LOREM),
            div(a("Home").att$("href", "#")),
          ),
          "/bar": () => div(
            h1("Bar"),
            p(LOREM),
            div(a("Home").att$("href", "#"))
          )
        } [route()]
      ));
    </script>
  </body>
</html>
```
