import tag from './tag.js';

function sourceMapJump(url, ns, map) {
  try {
    if (!map && ns) {
      map = ns;
      ns = null;
    }

    else if (!map && url) {
      map = url
      url = null;
    }

    let newOBJ = { imports: {} }

    window?.srcJump
      ? 0
      : window.srcJump = {}

    return new Promise((resolve, reject) => {
      try {
        Object.entries(map.imports).forEach(([importName, _url], i) => {
          newOBJ.imports[`${ns ? '@' + ns + '/' : ''}${importName}`] = (url ?? '') + _url;

          document.head.append(
            tag('script')
              .att$('src', (url ?? '') + _url)
              .att$('type', 'module')
              .get$(),

            tag('script')
              .att$('type', 'module')
              .text$(`
                import * as imports from '${(url ?? '/') + _url}';

                Object.entries(imports).forEach(arr => {
                  window.srcJump['${importName || _url}'] = window['${importName || _url}'] = {...arr}
                })
              `)
              .get$()
          )

        })

        resolve(newOBJ)
      } catch (e) {
        reject(e)
      }
    })

      .then((newOBJ) => {
        const mapContent = JSON.stringify(newOBJ);
        const mapScript = tag("script")
          .att$('type', 'importmap')
          .text$(mapContent);

        try {
          document.head.appendChild(mapScript.element);
        } catch (e) { }
      })

      .catch((e) => {
        console.error(e);

        return null;
      })

      .finally(() => {
        return null;
      })


  } catch (error) {
    console.error(`sourceMapJump error: ${error.message}`);
  }

  return null
}

export default sourceMapJump;