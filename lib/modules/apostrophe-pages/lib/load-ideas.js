const rp              = require('request-promise');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../../services/cache').cache;
const cache_lifespan  = 15*60;   // set lifespan of 15 minutes;

module.exports =  function (req, res, next) {
  const globalData = req.data.global;
  const csrf = req.data.csrf;

  const apiUrl = internalApiUrl ? internalApiUrl : req.data.apiUrl;

  const appUrl = req.data.appUrl;
  const googleMapsApiKey = req.data.googleMapsApiKey;

  const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
  const headers = {
    'Accept': 'application/json',
  };

  const thisHost = req.headers['x-forwarded-host'] || req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const fullUrl = protocol + '://' + thisHost + req.originalUrl;
  const parsedUrl = url.parse(fullUrl, true);

  //add url
  req.data.currentPath = parsedUrl.path;
  req.data.currentPathname = parsedUrl.pathname;
  req.data.currentUrl = fullUrl;

  /**
   * Fetch all ideas connected to the sites
   */
  if (globalData.siteId) {
    let ideas;

    // if cacheIdeas is turned on, get ideas from cache
    if (globalData.cacheIdeas) {
      let cacheKey = 'ideas-' + globalData.siteId;
      ideas = cache.get(cacheKey);
    }


    // if cacheIdeas is turned on, get ideas from cache
    if (ideas && ideas.length > 0) {
      req.data.ideas = ideas;
      req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);
      next();
    } else {
      //const globalData = req.data.global;
      const sort = req.query.sort ? req.query.sort : 'createdate_desc';

      var options = {
           uri: `${apiUrl}/api/site/${globalData.siteId}/idea?sort=${sort}&includeVoteCount=1&includeUserVote=1&includeTags=1`,
           headers: headers,
           json: true // Automatically parses the JSON string in the response
     };

     rp(options)
       .then(function (ideas) {
         const ideaSlug = req.data.global.ideaSlug;
         const ideaOverviewSlug = req.data.global.ideaOverviewSlug;
         const protocol = req.headers['x-forwarded-proto'] || req.protocol;

         /**
          * Format ideas data
          */
         ideas = ideas.map((idea) => {
           let createdData = new Date(idea.createdAt);
           idea.fullUrl = `${protocol}://${thisHost}/${ideaSlug}/${idea.id}`;
           idea.overviewUrl = `${protocol}://${thisHost}/${ideaOverviewSlug}?ideaId=${idea.id}`;
           idea.createdTime = createdData.getTime();

           if (idea.location && idea.location.coordinates[0] && idea.location.coordinates[1]) {
              let lat = idea.location.coordinates[0];
              let lng = idea.location.coordinates[1];
              let flag = req.data.global.mapImageFlag ? 'flag-' + req.data.global.mapImageFlag : 'flag-red';
              idea.locationMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=380x214&maptype=roadmap&markers=icon:${appUrl}/img/idea/${flag}.png|${lat},${lng}&key=${googleMapsApiKey}`;
              idea.locationUrl = `https://maps.google.com/?ll=${lat},${lng}`;
           }

           return idea;
         });

         //add ideas to to the data object so it's available in templates
         req.data.ideas = ideas;

         // filter the ideas the user voted for
         req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);

         // set the cache,
         if (req.data.global.cacheIdeas) {
           cache.set('ideas-' +req.data.global.siteId, req.data.ideas, {
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
