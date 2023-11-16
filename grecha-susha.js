class Grecha {
  constructor(window) {
    let g_ = this;

    class ElementWrapper {

      static LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

      static _lorem_ = function() {
        window.LOREM = ElementWrapper.LOREM;
      }()

      static RouterSymbol = Symbol.for("grecha-router");
      static CoreSymbol = Symbol.for("grecha-core");

      /* We create attractive class. */

      constructor(name, ...children) {
        if (typeof name === "string") {
          this.element = document.createElement(name);

        } else {
          this.element = name;
        }

        let methods = this.methods();

        Object.assign(this, methods);
        Object.assign(this.element, methods);

        if (children) for (const child of children) {
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

          __LOREM__() { return ElementWrapper.LOREM },
          get LOREM() { return this.__LOREM__() },

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
          },

          // @ Tag Wrapper
          wrap$(t) {
            // Contains <b data-grecha>?
            // Get Only child

            let w = cw.element.querySelector('[data-grecha="wrap$' + t + '"]');

            // has attr ?
            if (!w) {
              let b = new ElementWrapper(t);

              if (t && t instanceof HTMLElement) {
                b._changeElement(t);
              }

              b.att$('data-grecha', 'wrap$' + t);

              b.element.innerHTML = cw.element.innerHTML
              cw.element.innerHTML = '';
              cw.element.appendChild(b.element);

              return cw.element;
            } else {

              // Get wrapped element

              console.log(w);
              cw.element.innerHTML = w.innerHTML;
              w.innerHTML = '';

              // Remove w node from Document.
              w?.remove?.()

              return cw.element;

            }
          },

          bold$() {
            return this.wrap$('b')

          },

          italic$() {
            return this.wrap$('i')

          },

          underline$() {
            return cw.wrap$('u')

          },

          strike$() {
            return cw.wrap$('s')

          },

          // Into Link
          link$(href, text) {
            let wrapped = this.wrap$('a')

            if (wrapped && (href || text)) {
              wrapped.firstChild.att$('href', href)
              wrapped.firstChild.att$('target', '_blank')
              wrapped.firstChild.att$('rel', 'noopener noreferrer')
              wrapped.firstChild.att$('title', text)

              return wrapped
            }
          },

          // Set XY
          absolutePos$(x, y) {
            cw.element.style.position = 'absolute';
            cw.element.style.display = 'flex';
            cw.element.style.flexWrap = 'wrap';

            cw.element.style.left = x;
            cw.element.style.top = y;
          },

          // Reset Position
          resetPos$() {
            cw.element.style.position = 'static';
            cw.element.style.display = 'block';
            cw.element.style.flexWrap = 'nowrap';

            cw.element.style.left = '';
            cw.element.style.top = '';
          },

          // Register a new attribute for a custom data type
          data$(key, value) {
            this.att$(`data-${key}`, value);
            return this;
          },

          // Append a child element
          append$(child) {
            if (child instanceof ElementWrapper) {
              this.element.appendChild(child.element);
            } else if (child instanceof HTMLElement) {
              this.element.appendChild(child);
            } else if (typeof child === 'string') {
              this.element.appendChild(document.createTextNode(child));
            }
            return this;
          },

          // Set ID attribute
          id$(id) {
            this.att$('id', id);
            return this;
          },

          // Set classes
          class$(...classes) {
            this.element.classList.add(...classes);
            return this;
          },

          // Set styles directly on an element
          style$(styleObject) {
            for (const property in styleObject) {
              this.element.style[property] = styleObject[property];
            }
            return this;
          },

          // Toggle class on an element
          toggleClass$(className) {
            this.element.classList.toggle(className);
            return this;
          },

          // Set inner HTML
          html$(htmlContent) {
            this.element.innerHTML = htmlContent;
            return this;
          },

          // Set inner Text
          text$(textContent) {
            this.element.textContent = textContent;
            return this;
          },

          // Additional methods to be included in the ElementWrapper class

          // Set a placeholder attribute for an input element
          placeholder$(placeholderValue) {
            this.att$('placeholder', placeholderValue);
            return this;
          },

          // Set the type attribute for an input or button element
          type$(typeValue) {
            this.att$('type', typeValue);
            return this;
          },

          // Add an event listener
          on$(event, handler) {
            this.element.addEventListener(event, handler);
            return this;
          },

          // Remove an event listener
          off$(event, handler) {
            this.element.removeEventListener(event, handler);
            return this;
          },

          // Perform an action upon pressing the Enter key
          onEnter$(callback) {
            this.on$('keydown', (e) => {
              if (e.key === 'Enter') callback(e);
            });
            return this;
          },

          // Focus the element
          focus$() {
            this.element.focus();
            return this;
          },

          // Blur the element
          blur$() {
            this.element.blur();
            return this;
          },

          // Add an attribute for accessibility purposes
          aria$(key, value) {
            this.att$(`aria-${key}`, value);
            return this;
          },

          // Append multiple children at once
          appendChildren$(...children) {
            children.forEach((child) => {
              this.append$(child);
            });
            return this;
          },

          // Set the disabled attribute on an element
          disabled$(isDisabled) {
            if (isDisabled) {
              this.att$('disabled', 'true');
            } else {
              this.element.removeAttribute('disabled');
            }
            return this;
          },

          // Create and append a new child element
          createElement$(tag, ...children) {
            this.append$(new ElementWrapper(tag, ...children));
            return this;
          },

          // Fetch and display content - Example: Asynchronous operation to load data
          fetchContent$(url, processContentCallback) {
            fetch(url)
              .then(response => response.json())
              .then(data => processContentCallback(this, data))
              .catch(error => console.error('Error:', error));
            return this;
          },

          style$(styleObject) {
            Object.assign(this.element.style, styleObject);
          },

          stylesheet$() {
            // Stylesheets are cached in the wrapper
            if (this?._stylesheet) {
              return this._stylesheet;
            }

            // Create a new stylesheet
            const stylesheet = new ElementWrapper(document.createElement('style'));

            // Append the stylesheet to the wrapper
            this.append$(stylesheet);
          },

          bounds$() {
            return this.element.getBoundingClientRect();
          },

          str$() {
            return this.element.outerHTML;
          
          },

        }

      }

      _changeElement(el) {
        this.element = el;

        this._applyMethods();

        return this;
      }

      _applyMethods() {
        Object.assign(this.element, this.methods);
      }
    }

    function tag(tag, ...children) {
      return new ElementWrapper(tag, ...children).get$();
    }

    function depadString(str = '', cnln = 0) {
      // For each line, remove cnln

      var gr_ = () => {
        return str
          .split('\n')
          .map((line) => line.slice(cnln))
          .join('\n')
      }

      var lr_ = (am) => {
        return str
          .split('\n')
          .map((line) => ' '.repeat(am) + line)
          .join('\n')
      }

      if (cnln < 0) {
        // Neg, so add WS
        return lr_(-cnln)
      }

      else if (cnln < 1) {
        // Get lenth of whitespace on first line
        cnln = str.match(/^\s*/)[0].length
      }

      return gr_()
    }

    // @ Tag-init for basic wrapping tags
    const MUNDANE_TAGS = [
      "canvas",

      "h1",
      "h2",
      "h3",

      "p",
      "a",

      "div",
      "span",

      "html",
      "head",
      "body",
    ];

    for (const tagName of MUNDANE_TAGS) {
      window[tagName] = (...children) => tag(tagName, ...children);
    }
    // ---

    // @ Tagware
    const windowMethods = {

      tag,

      htmlDoc(...nodes) {
        return tag('', ...nodes);
      },

      // @ Basic
      img(src) {
        // return new ElementWrapper("img").att$("src", src).get$();
        return tag("img").att$("src", src)
      },

      input(type) {
        // return new ElementWrapper("input").att$("type", type).get$();
        return tag("input").type$(type)
      },

      button(text) {
        // return new ElementWrapper("button").att$("text", text).get$();
        return tag("button").att$('text', text)
      },

      select(...options) {
        let select = tag("select");
        for (const option of options) {
          select.appendChild(tag("option").att$("value", option));
        }
        return select;
      },

      // @ Router
      router(routes) {
        const resultWrapper = div().wrapper$();
        const result = resultWrapper.get$();

        const GR_SYM = ElementWrapper.RouterSymbol;
        const GC_SYM = ElementWrapper.CoreSymbol;

        // Expose wrapper for quick access
        window[GR_SYM] = resultWrapper;

        // @ CREDIT (FORK): juniorrantila
        for (const k in routes) routes[k].state = { id: 0 };

        let locations = {
          url() { return new URL(window.location) },
          hashLocation(url) { return (url ?? this.url()).hash.slice(1) || '/' },
        }

        var url = locations.url();
        var hashLocation = locations.hashLocation();

        const currentLocation = { value: hashLocation };

        if (!routes[currentLocation.value]) {
          currentLocation.value = '/';
        }
        const state = () => routes[currentLocation.value].state;

        // ---

        let methods = {

          get __handler__() { return window[GR_SYM] },

          syncHash() {
            // @ CREDIT (FORK): juniorrantila
            state().id = 0;

            url = locations.url();
            hashLocation = locations.hashLocation(url);

            const route404 = '/404';

            if (!(hashLocation in routes)) {
              console.assert(route404 in routes, `Route "${route404}" not found among the routes.`);
              hashLocation = route404;
            }

            result.replaceChildren(routes[hashLocation](result));
            currentLocation.value = hashLocation;

            // @ Window Handler
            window[GC_SYM]?.syncHash?.(hashLocation);

            return result;
          },

          destroyGrechaSync() {
            window.removeEventListener("hashchange", methods.syncHash);
          },

          deleteGrecha() {
            delete window[g_];
            for (const method in methods) delete window[method];
            delete window[GR_SYM];
          },

          // @ CREDIT (FORK): juniorrantila
          useState(initialValue) {
            const id = state().id++;

            state()[id] = state()[id] ?? initialValue;

            return [
              () => state()[id],
              (v) => {
                state()[id] = v;
                result.refresh();
              }
            ];
          },
          // ---

        }

        window.addEventListener("hashchange", methods.syncHash);

        Object.assign(result, methods);

        // @ Some simplification/quality of life changes. 
        result.refresh = result.syncHash;
        // ---

        methods.syncHash();

        return result;
      },

      // @ Quick-Canvas
      qCanvas(context, ...args) {
        const canvas = tag('canvas');
        const ctx = canvas.getContext(context || "2d");

        for (const [i, arg] of args.entries()) {
          if (typeof arg === "string") {
            canvas.setAttribute(arg, args[i + 1]);
          }

          else if (typeof arg === "function") {
            canvas.addEventListener(arg.name, arg);
          }

          else if (typeof arg === "object") {
            Object.assign(canvas, arg);
          }
        }

        return {
          canvas,
          ctx,
        };
      },

      // @ Quick-Image
      qImage(src) {
        const image = img(src)
        return {
          image,
        };

      },

      tabSwitcher(names, choose) {
        return div(
          ...names.map((name, i) => {
            return span(
              a(
                p(name)
                  // @ We spec.
                  .att$("href", `#`)
                  .onclick$(() => choose(i))
              )
            ).att$('class', 'tab')

          })
        ).att$('class', 'tab-switcher')
      },

      tabs(ts) {
        const names = Object.keys(ts);
        const tags = Object.values(ts);

        let active = 0;
        const tabSlot = div(
          tags[active]
        )

        return div(
          tabSwitcher(names, (i) => {
            tabSlot.replaceChildren(tags[active]);
            tabSlot.appendChild(tags[i]);
            active = i;
          })
        )
      },

      webgl(w, h) {
        const p_h = h ?? 112;
        const p_w = w ?? 112;

        const previewCanvas = this.qCanvas(
          "webgl",

          ["width", p_w,],
          ["height", p_h,],
          ["class", "preview-canvas",]
        )

        if (previewCanvas.ctx === null) {
          throw new MediaError(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
          );
        }

        return previewCanvas
      },

      distance(el1, el2) {
        if (!(el1?.element || el2?.element)) return;
        const rect1 = el1.element.bounds$();
        const rect2 = el2.element.bounds$();

        // From Center
        const x = Math.abs(rect1.x + rect1.width / 2 - rect2.x - rect2.width / 2);
        const y = Math.abs(rect1.y + rect1.height / 2 - rect2.y - rect2.height / 2);
        return Math.sqrt(x * x + y * y);

      },

      animate(e, cb) {
        const shouldLoop = Symbol.for("ShouldLoop");
        e[shouldLoop] = true;

        let animationFrameId;

        const looper = () => {
          if (!e[shouldLoop]) {
            return;
          }

          cb(() => {
            e[shouldLoop] = true
            if (e[shouldLoop]) {
              animationFrameId = requestAnimationFrame(looper);
            }
          });

          animationFrameId = requestAnimationFrame(looper);
        };

        looper()

        return () => {
          e[shouldLoop] = false;
          cancelAnimationFrame(animationFrameId);
        };
      },

      // @ Advanced

      depadString,

      createDocument(...args) {
        return new DOMParser()
          .parseFromString(args, "text/html")
      },

      SushaTemplates: {
        get document() {
          return createDocument(

          )
        },
      }

    }
    // ---

    // @ Class Exports
    if (typeof module == 'undefined') {
      Object.assign(window, windowMethods);
    }

  }
}

// @ Module Exports
if (typeof module !== 'undefined') {
  module.exports = {
    Grecha,

  };

} else {
  window.__Grecha__ = Grecha;
  new Grecha(window);
}