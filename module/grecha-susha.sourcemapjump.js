import sourceMapJump from './sourcemapjump.js';

let url = location.href;

sourceMapJump({
  imports: {
    "elementWrapper": "module/src/elementWrapper.js",
    "globalMethods": "module/src/globalMethods.js",
    "ElementWMethods": "module/src/ElementWMethods.js",
    "tag": "module/tag.js",
    "sourcemapjump": "module/sourcemapjump.js",
  }
})