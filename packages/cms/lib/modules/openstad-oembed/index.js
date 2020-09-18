const urls = require('url');

module.exports = {
  improve: 'apostrophe-oembed',
  construct: function (self, options) {
    
    const superOpenGraph = self.openGraph;
    
    self.openGraph = function (req, url, callback) {
      // To prevent SSRF, we check if the requested URL is whitelisted before
      // performing a request and building the oembed response.
      if (url.match(/^\/\//)) {
        // Protocol-relative URLs are commonly found
        // in markup these days and can be upgraded
        // to https so that they work
        url = 'https:' + url;
      }
      
      const parsed   = urls.parse(url);
      
      if (!parsed) {
        return callback(new Error('oembetter openGraph: invalid URL: ' + url));
      }
      
      if ((parsed.protocol !== 'http:') && (parsed.protocol !== 'https:')) {
        return callback(new Error('oembetter openGraph: URL is neither http nor https: ' + url));
      }
      
      if (self.oembetter._whitelist) {
        let good = false;
        for (i = 0; (i < self.oembetter._whitelist.length); i++) {
          if (!parsed.hostname) {
            continue;
          }
          if (self.oembetter.inDomain(self.oembetter._whitelist[i], parsed.hostname)) {
            good = true;
            break;
          }
        }
        if (!good) {
          // We can return a status code instead of a complete error
          return callback(500);
        }
      }
      
      return superOpenGraph(req, url, callback);
    }
  }
}
