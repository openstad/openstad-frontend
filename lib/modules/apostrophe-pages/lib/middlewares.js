const eventEmitter = require('../../../../events').emitter;
const cache = require('../../../../services/cache').cache;

module.exports = (self, options) => {

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
