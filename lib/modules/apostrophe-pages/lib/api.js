const cache_lifespan  = 15*60;   // set lifespan of 15 minutes;
const url             = require('url');

module.exports = (self, options) => {
  self.mapIdeas = (req, ideas) => {
    const globalData = req.data.global;

    const appUrl = req.data.appUrl;
    const googleMapsApiKey = req.data.googleMapsApiKey;

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
    if (! globalData.siteId) {
      return null;
    }

    // if cacheIdeas is turned on, get ideas from cache
    if (globalData.cacheIdeas) {
      let cacheKey = 'ideas-' + globalData.siteId;
      ideas = cache.get(cacheKey);
    }

    // if cacheIdeas is turned on, get ideas from cache
    if (ideas && ideas.length > 0) {
      req.data.ideas = ideas;
      req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);
      return;
    }

    const ideaSlug = req.data.global.ideaSlug;
    const ideaOverviewSlug = req.data.global.ideaOverviewSlug;

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
      cache.set('ideas-' + req.data.global.siteId, req.data.ideas, {
        life: cache_lifespan
      });
    }

  };

  self.addRankingToIdeas = function (req) {
    let counter = 1;
    req.data.ideas =  req.data.ideas ? req.data.ideas
      .sort((ideaA, ideaB) => {
        return ideaB.yes - ideaA.yes;
      })
      .map((idea) => {
        idea.ranking = counter;
        idea.extraData.ranking = counter;
        counter++;
        return idea;
      }) : [];
  }

  /**
   * Determine if there is an active idea based upon the url query ?=ideaId of params /:ideaId
   */
  self.setActiveIdeaId = function (req) {
    const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
    if (ideaId) {
      if (!req.data.idea) {
        req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
      }
      req.data.ideaId = ideaId;
    }


  };
};
