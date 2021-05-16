# Grecha.js

![KashaHard](KashaHard.gif)

Simple Front-End JavaScript Framework. Originally designed for [emoteJAM](https://github.com/tsoding/emoteJAM). The name basically means [buckwheat](https://en.wikipedia.org/wiki/Buckwheat) in russian.

## Quick Start

https://tsoding.org/grecha.js/example.html

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

      entry.appendChild(
        router({
          "/": div(
            h1("Grecha.js"),
            div(a("Foo").att$("href", "#/foo")),
            div(a("Bar").att$("href", "#/bar")),
            div(kasha).onclick$(function () {
                if (this.contains(kasha)) {
                    kasha.replaceWith(kashaHard);
                } else {
                    kashaHard.replaceWith(kasha);
                }
            }),
          ),
          "/foo": div(
            h1("Foo"),
            p(LOREM),
            div(a("Home").att$("href", "#")),
          ),
          "/bar": div(
            h1("Bar"),
            p(LOREM),
            div(a("Home").att$("href", "#"))
          )
        })
      );
    </script>
  </body>
</html>
```
