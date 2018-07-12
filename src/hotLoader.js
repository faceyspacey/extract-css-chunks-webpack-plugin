const path = require('path');
const loaderUtils = require('loader-utils');

const defaultOptions = {
  fileMap: '{fileName}',
};

function hotReload(content) {
  this.cacheable();
  const options = Object.assign(
    {},
    defaultOptions,
    loaderUtils.getOptions(this),
  );

  return `${content}
    if(module.hot) {
      // ${Date.now()}
      var cssReload = require(${loaderUtils.stringifyRequest(
    this,
    `!${path.join(__dirname, 'hotModuleReplacement.js')}`,
  )})(module.id, ${JSON.stringify(options)});
      module.hot.dispose(cssReload);
      module.hot.accept(undefined, cssReload);
    }
  `;
}

module.exports = hotReload;
