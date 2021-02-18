const fileCache = require('node-file-cache').create();  // default configuration
const memCache  = require('memory-cache');
const qs = require('qs');

//const useFileCache = process.env.FILE_CACHE === 'ON' ? true : false;

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

/**
 * All anonymous request gets served from cache
 * As soon as a JWT is found we add a cookie that skips the cache
 * Saving of the content to cache is done in the openstad-template-cache module
 * Since it uses apostrope functionality to cache
 *
 * The display the cache is done before Apostrophe is fired this saves a lot of response time
 * and resources. It does however mean req.session and req.cookies are not available yet
 * Since this is done by apostrophe's express module.
 *
 * Therefore we parse cookies directly from the header, not
 *
 * getCacheKey: (function(*): string),
 * shouldBeCached: (function(*)),
 * setNoCacheForThisSession: (function(*): *),
 * clearNoCache: (function(*): *)}
 *
 */
myCache.request = {
  cacheLifespan: 3600, // in seconds
  setNoCacheForThisSession: (req, res) => {
    // we use a cookie because this
    res.cookie('noPageCache', true, { maxAge: 900000});
    // return req.cookies.save();
  },

  clearNoCache : (req, res) => {
    res.cookie('noPageCache', {maxAge: 0});
    // cookies.set('testtoken', {expires: Date.now()});
  },

  getCacheKey: (req) => {
    return encodeURIComponent(`${req.site.id}-${req.url}?${qs.stringify(req.query)}`)
  },

  //adds no cache to request if conditions are met
  addNoCache: async (req) => {


    console.log('req.query.jwt', req.query.jwt)
    console.log('shouldAddNoCache', shouldAddNoCache)
    console.log('noCacheNotThere', noCacheNotThere)


  },

  shouldBeCached: async (req) => {
    // as soon as JWT is found in the URL
    // we set the no cache for this session

    // this is before anything cookies and session middleware is run
    // so at this point cookies can be found in the req.headers.cookie as a string
    console.log('shouldBeCached req.headers.cookie', req.headers.cookie);
    console.log('shouldBeCached req.headers.cookie.includes(\'noPageCache=true\')', req.headers.cookie.includes('noPageCache'));
    console.log('shouldBeCached req.query', req.query);
    console.log('shouldBeCached req.url', req.url);
    console.log('shouldBeCached req.url.includes(\'/modules/apostrophe\')', req.url.includes('/modules/apostrophe'));

    return req.method === 'GET'
        && !req.query.jwt
        && !req.headers.cookie.includes('noPageCache=true')
        && !req.url.includes('/logout')
        && !req.url.includes('/login')
        && !req.url.includes('/modules/apostrophe')
  }
}


exports.clearCache = myCache.clearCache;
exports.cache = myCache;
