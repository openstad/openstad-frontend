const cache  = require('node-file-cache').create();  // default configuration

exports.clearCache = () => {
  cache.clear();
};

exports.cache = cache;
