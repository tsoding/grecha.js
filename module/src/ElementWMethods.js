let Methods = (cw, class_) => new Object({

  __LOREM__() { return class_.LOREM },
  get LOREM() { return cw.__LOREM__() },

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
      let b = new class_(t);

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
    return cw.wrap$('b')

  },

  italic$() {
    return cw.wrap$('i')

  },

  underline$() {
    return cw.wrap$('u')

  },

  strike$() {
    return cw.wrap$('s')

  },

  // Into Link
  link$(href, text) {
    let wrapped = cw.wrap$('a')

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
    cw.att$(`data-${key}`, value);
    return cw;
  },

  // Append a child element
  append$(child) {
    if (child instanceof class_) {
      cw.element.appendChild(child.element);
    } else if (child instanceof HTMLElement) {
      cw.element.appendChild(child);
    } else if (typeof child === 'string') {
      cw.element.appendChild(document.createTextNode(child));
    }
    return cw;
  },

  // Set ID attribute
  id$(id) {
    cw.att$('id', id);
    return cw;
  },

  // Set classes
  class$(...classes) {
    cw.element.classList.add(...classes);
    return cw;
  },

  // Set styles directly on an element
  style$(styleObject) {
    for (const property in styleObject) {
      cw.element.style[property] = styleObject[property];
    }
    return cw;
  },

  // Toggle class on an element
  toggleClass$(className) {
    cw.element.classList.toggle(className);
    return cw;
  },

  // Set inner HTML
  html$(htmlContent) {
    cw.element.innerHTML = htmlContent;
    return cw;
  },

  // Set inner Text
  text$(textContent) {
    cw.element.textContent = textContent;
    return cw;
  },

  // Additional methods to be included in the ElementWrapper class

  // Set a placeholder attribute for an input element
  placeholder$(placeholderValue) {
    cw.att$('placeholder', placeholderValue);
    return cw;
  },

  // Set the type attribute for an input or button element
  type$(typeValue) {
    cw.att$('type', typeValue);
    return cw;
  },

  // Add an event listener
  on$(event, handler) {
    cw.element.addEventListener(event, handler);
    return cw;
  },

  // Remove an event listener
  off$(event, handler) {
    cw.element.removeEventListener(event, handler);
    return cw;
  },

  // Perform an action upon pressing the Enter key
  onEnter$(callback) {
    cw.on$('keydown', (e) => {
      if (e.key === 'Enter') callback(e);
    });
    return cw;
  },

  // Focus the element
  focus$() {
    cw.element.focus();
    return cw;
  },

  // Blur the element
  blur$() {
    cw.element.blur();
    return cw;
  },

  // Add an attribute for accessibility purposes
  aria$(key, value) {
    cw.att$(`aria-${key}`, value);
    return cw;
  },

  // Append multiple children at once
  appendChildren$(...children) {
    children.forEach((child) => {
      cw.append$(child);
    });
    return cw;
  },

  // Set the disabled attribute on an element
  disabled$(isDisabled) {
    if (isDisabled) {
      cw.att$('disabled', 'true');
    } else {
      cw.element.removeAttribute('disabled');
    }
    return cw;
  },

  // Create and append a new child element
  createElement$(tag, ...children) {
    cw.append$(new class_(tag, ...children));
    return cw;
  },

  // Fetch and display content - Example: Asynchronous operation to load data
  fetchContent$(url, processContentCallback) {
    fetch(url)
      .then(response => response.json())
      .then(data => processContentCallback(cw, data))
      .catch(error => console.error('Error:', error));
    return cw;
  },

  style$(styleObject) {
    Object.assign(cw.element.style, styleObject);
  },

  stylesheet$() {
    // Stylesheets are cached in the wrapper
    if (cw?._stylesheet) {
      return cw._stylesheet;
    }

    // Create a new stylesheet
    const stylesheet = new class_(document.createElement('style'));

    // Append the stylesheet to the wrapper
    cw.append$(stylesheet);
  },

  bounds$() {
    return cw.element.getBoundingClientRect();
  },

  str$() {
    return cw.element.outerHTML;

  },

})

// @ EXP
export default Methods;