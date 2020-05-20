const rp              = require('request-promise');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../../services/cache').cache;
const cache_lifespan  = 15*60;   // set lifespan of 15 minutes;

module.exports =  function (req, res, next) {
  const globalData = req.data.global;
  const apiUrl = internalApiUrl ? internalApiUrl : req.data.apiUrl;
  const headers = {
    'Accept': 'application/json',
  };

  /**
   * Fetch all ideas connected to the sites
   */
  if (globalData.siteId) {
    let tags;

    // if cacheIdeas is turned on, get ideas from cache
    // cacheIdeas is old key, should be refactored,
    // preferable we always have caching on
    if (globalData.cacheIdeas) {
      let cacheKey = 'tags-' + globalData.siteId;
      tags = cache.get(cacheKey);
    }

    if (tags && tags.length > 0) {
      req.data.openstadTags = tags;
      next();
    } else {
      var options = {
         uri: `${apiUrl}/api/site/${globalData.siteId}/tag`,
         headers: headers,
         json: true // Automatically parses the JSON string in the response
     };

     rp(options)
       .then(function (response) {
         //add tags to to the data object so it's available in templates
         //use openstadTags instead of tags  to prevent colliding with Apos
         req.data.openstadTags = response;

         // set the cache
         if (globalData.cacheIdeas) {
           cache.set('tags-' +req.data.global.siteId, response, {
             life: cache_lifespan
           });
         }
         next();
         return null;
       })
       .catch((e) => {
         next();
         return null;
       });
     }
  } else {
    next();
  }
}
