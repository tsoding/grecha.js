import tag from '../tag.js';
import depadString from '../depadString.js';
import ElementWrapper from './elementWrapper.js';

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

    let WSt = window[GC_SYM] = {
      WindowState: {
        current: null,
        history: [],
        stack: [],
      }
    }

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

export default windowMethods;