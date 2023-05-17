const fetch           = require('node-fetch');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../../services/cache').cache;
const cacheLifespan  = 8*60*60;   // set lifespan of 8 hours;

module.exports = async function (req, res, next) {
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
  const baseUrl = protocol + '://' + thisHost;
  const fullUrl = baseUrl + req.originalUrl;
  const parsedUrl = url.parse(fullUrl, true);


  //add url
//  req.data.siteUrl = siteUrl;
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
      return next();
    } else {

      //const globalData = req.data.global;
      const sort = req.query.sort ? req.query.sort : 'createdate_desc';

      try {
        let response = await fetch(`${apiUrl}/api/site/${globalData.siteId}/idea?sort=${sort}&includeVoteCount=1&includeUserVote=1&includeTags=1&includeArgsCount=1`, {
          headers,
        })
        if (!response.ok) {
          console.log(response);
          throw new Error('Fetch failed')
        }
        let ideas = await response.json();

        const ideaSlug = req.data.global.ideaSlug;
        const ideaOverviewSlug = req.data.global.ideaOverviewSlug;
        const siteUrl = req.data.cmsUrl;

        /**
         * Format ideas data
         */
        ideas = ideas.map((idea) => {
          let createdData = new Date(idea.createdAt);
          idea.fullUrl = ideaSlug && ideaSlug.match(/\{ideaId\}/i) ? `${siteUrl}/${ideaSlug.replace(/\{ideaId\}/ig, idea.id)}` : `${siteUrl}/${ideaSlug}/${idea.id}`;
          idea.overviewUrl = ideaOverviewSlug && ideaOverviewSlug.match(/\{ideaId\}/i) ? `${siteUrl}/${ideaOverviewSlug.replace(/\{ideaId\}/ig, idea.id)}` : `${siteUrl}/${ideaOverviewSlug}?ideaId=${idea.id}`;
          idea.createdTime = createdData.getTime();

          return idea;
        });

        //add ideas to to the data object so it's available in templates
        req.data.ideas = ideas;

        // filter the ideas the user voted for
        req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);

        // set the cache,
        if (req.data.global.cacheIdeas) {
          cache.set('ideas-' +req.data.global.siteId, req.data.ideas, {
            life: cacheLifespan
          });
        }

        next();
        return null;
      } catch(err) {
        console.log('eroror again ', e)
        next();
        return null;
      };
     }
  } else {
    return next();
  }
}
