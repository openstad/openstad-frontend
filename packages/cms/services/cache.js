const fileCache = require('node-file-cache').create({
  file: "/tmp/node-file-cache"
});
const memCache  = require('memory-cache');
const useFileCache = false;
// de api van deze cache service is die van node-file-cache, want dat wordt overal gebruikt.
// zonodig wordt dat hier vertaald naar api van memcache


let myCache;

if (useFileCache) {

  myCache = {

    clearCache: () => {
      fileCache.clear();
    },

    get: key => {
      return fileCache.get(key);
    },

    set: (key, item, options) => {
      fileCache.set(key, item, options);
    },

  };

} else {

  myCache = {

    clearCache: () => {
      memCache.clear();
    },

    get: key => {
      return memCache.get(key);
    },

    set: (key, item, options) => {
      memCache.put(key, item, options && options.life && ( options.life * 1000 ), () => {});
    },

  };

}

exports.clearCache = myCache.clearCache;
exports.cache = myCache;
