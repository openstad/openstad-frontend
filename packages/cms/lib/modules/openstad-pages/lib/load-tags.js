const rp              = require('request-promise');
const _ = require('lodash');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
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
    let tags;
    let retrievedEmpty = false;
    // if cacheIdeas is turned on, get ideas from cache
    // cacheIdeas is old key, should be refactored,
    // preferable we always have caching on

    if (globalData.cacheIdeas) {
      let cacheKey = 'tags-' + globalData.siteId;
      tags = cache.get(cacheKey);
      retrievedEmpty = cache.get(globalData.siteId + '-retrieved-tags-empty');
    }
    
    if (Array.isArray(tags)) {
      req.data.openstadTags = tags;
      req.data.groupedOpenstadTags = _.groupBy(tags, function(tag){return tag.type});

      next();
    } else if(retrievedEmpty) {
      req.data.openstadTags = [];
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
          req.data.groupedOpenstadTags = _.groupBy(response, function(tag){return tag.type});

          // set the cache
          if (globalData.cacheIdeas) {
            cache.set(globalData.siteId + '-retrieved-tags-empty', response.length === 0, {
              life: cacheLifespan
            })

            cache.set('tags-' +req.data.global.siteId, response, {
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
