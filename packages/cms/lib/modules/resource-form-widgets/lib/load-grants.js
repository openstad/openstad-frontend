const rp              = require('request-promise');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../../services/cache').cache;
const cacheLifespan  = 15*60;   // set lifespan of 15 minutes;

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
    let grants;

    // if cacheIdeas is turned on, get ideas from cache
    // cacheIdeas is old key, should be refactored,
    // preferable we always have caching on
    if (globalData.cacheIdeas) {
      let cacheKey = 'grant-' + globalData.siteId;
      grants = cache.get(cacheKey);
    }

    if (Array.isArray(grants)) {
      req.data.openstadGrants = grants;
      next();
    } else {

      var options = {
        uri: `${apiUrl}/api/site/${globalData.siteId}/grant`,
        headers: headers,
        json: true // Automatically parses the JSON string in the response
      };
      
      rp(options)
        .then(function (response) {
          //add tags to to the data object so it's available in templates
          //use openstadTags instead of tags  to prevent colliding with Apos
          req.data.openstadGrants = response.records;

          // set the cache
          if (globalData.cacheIdeas) {
            cache.set('grant-' +req.data.global.siteId, response.records, {
              life: cacheLifespan
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
