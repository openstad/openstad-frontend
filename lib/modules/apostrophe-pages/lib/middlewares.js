const eventEmitter = require('../../../../events').emitter;
const cache = require('../../../../services/cache').cache;

module.exports = (self, options) => {

  /**
   * Load in the ideas from the api and set to the req object
   */
  self.apos.app.use(async (req, res, next) => {
    req.data.csrf = self.apos.settings.getOption(req, 'csrf');
    req.data.apiUrl = self.apos.settings.getOption(req, 'apiUrl');
    req.data.appUrl = self.apos.settings.getOption(req, 'appUrl');
    req.data.googleMapsApiKey = self.apos.settings.getOption(req, 'googleMapsApiKey');

    const sort = req.query.sort ? req.query.sort : 'createdate_desc';

    let ideas;
    if (req.data.global.cacheIdeas) {
      let cacheKey = 'ideas-' + req.data.global.siteId;
      ideas = cache.get(cacheKey);
    } else {
      ideas = await self.apos.openstadApi.getAllIdeas(req, req.data.global.siteId, sort);
    }

    self.mapIdeas(req, ideas);

    next();
  });

  /**
   * Add route that clears all cache
   */
  self.apos.app.get('/clear-cache', (req, res, next) => {
    // if user is logged into apostrophe then allow cache reset
    if (req.user) {
      eventEmitter.emit('clearCache');
      return res.redirect(req.header('Referer') || '/');
    }
  });


};
