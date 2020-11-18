const rp              = require('request-promise');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../../services/cache').cache;
const cacheLifespan  = 8*60*60;   // set lifespan of 8 hours;

module.exports =  function (req, res, next) {
  const globalData = req.data.global;
  const csrf = req.data.csrf;

  const apiUrl = internalApiUrl ? internalApiUrl : req.data.apiUrl;

  const headers = {
    'Accept': 'application/json',
  };

  /**
   * Fetch all ideas connected to the sites
   */
  if (globalData.siteId) {
    let products;

    // if cacheIdeas is turned on, get ideas from cache
    if (globalData.cacheIdeas) {
      let cacheKey = 'products' + globalData.siteId;
      products = cache.get(cacheKey);
    }

    // if cacheIdeas is turned on, get ideas from cache
    if (products && products.length > 0) {
      req.data.products = products;
      next();
    } else {

      var options = {
         uri: `${apiUrl}/api/site/${globalData.siteId}/product`,
         headers: headers,
           json: true // Automatically parses the JSON string in the response
      };

      rp(options)
       .then(function (products) {
         console.log('productsss')

         /**
          * Format product data

         products = products.map((product) => {
           return product;
         });
          */

         //add ideas to to the data object so it's available in templates
         req.data.products = products;


         // set the cache,
         if (req.data.global.cacheIdeas) {
           cache.set('products' +req.data.global.siteId, req.data.products, {
             life: cacheLifespan
           });
         }

         next();
         return null;
       })
       .catch((e) => {
         console.log('eroror again ', e)
         next();
         return null;
       });
     }
  } else {
    next();
  }
}
