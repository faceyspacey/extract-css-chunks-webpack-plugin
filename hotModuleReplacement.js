module.exports = function(publicPath, outputFilename) {
  if (document) {
    var origin = document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
    var newHref = origin + publicPath + outputFilename;
    var styleSheets = document.getElementsByTagName('link');

	//update the stylesheet corresponding to `outputFilename`
    for (var i = 0; i < styleSheets.length; i++) {
      if (styleSheets[i].href) {
        var oldChunk = styleSheets[i].href.split('.')[0];
        var newChunk = newHref.split('.')[0];

        if (oldChunk === newChunk) {
          // date insures sheets update when [contenthash] is not used in file names
          var url = newHref + '?' + (+new Date);
          styleSheets[i].href = url;
          console.log('[HMR]', 'Reload css: ', url);
          break;
        }
      }
    }
  }
};
