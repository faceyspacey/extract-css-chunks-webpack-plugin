const path = require('path');
const loaderUtils = require('loader-utils');

const defaultOptions = {
  fileMap: '{fileName}',
  cssModules: true,
};

module.exports = function (content) {
  this.cacheable();
  const options = Object.assign(
        {},
        defaultOptions,
        loaderUtils.getOptions(this),
    );

  const accept = options.cssModules ? '' : 'module.hot.accept(undefined, cssReload);';
  return content + `
    if(module.hot) {
      // ${Date.now()}
      var cssReload = require(${loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, 'hotModuleReplacement.js'))})(module.id, ${JSON.stringify(options)});
      module.hot.dispose(cssReload);
      ${accept};
    }
  `;
};
