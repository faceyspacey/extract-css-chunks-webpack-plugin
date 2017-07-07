module.exports = function(publicPath, outputFilename) {
  if (document) {
    var origin = document.location.protocol + '//' + document.location.hostname + (document.location.port ? ':' + document.location.port: '');
    var newHref = origin + publicPath + outputFilename
    var styleSheets = document.getElementsByTagName('link');

	//update the stylesheet corresponding to `outputFilename`
    for (var i = 0; i < styleSheets.length; i++) {
      if (styleSheets[i].href) {
        var oldChunk = styleSheets[i].href.split('.')[0];
        var newChunk = newHref.split('.')[0];

        if (oldChunk === newChunk) {
          var oldSheet = styleSheets[i]
          var url = newHref + '?' + (+new Date)
          var head = document.getElementsByTagName('head')[0]
          var link = document.createElement('link')

          // date insures sheets update when [contenthash] is not used in file names
          link.href = url
          link.charset = 'utf-8'
          link.type = 'text/css'
          link.rel = 'stylesheet'

          head.insertBefore(link, oldSheet.nextSibling)

          // remove the old sheet only after the old one loads so it's seamless
          // we gotta do it this way since link.onload basically doesn't work
          var img = document.createElement('img')
          img.onerror = function() {
            oldSheet.remove()
            console.log('[HMR]', 'Reload css: ', url);
          }
          img.src = url
          break;
        }
      }
    }
  }
}

