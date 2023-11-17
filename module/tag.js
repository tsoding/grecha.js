import ElementWrapper from './src/elementWrapper.js';

function tag(tag, ...children) {
  let w_ = new ElementWrapper(tag, ...children)

  return w_.element;
}

export default tag;