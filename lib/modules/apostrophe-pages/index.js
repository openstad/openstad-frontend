// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

module.exports = {
  types: [
    {
      name: 'home',
      label: 'Home'
    },
    {
      name: 'idea',
      label: 'Idea'
    }

    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ],

  construct: function (self, options) {
    self.expressMiddleware = (req, res, next) => {
      const pageData = req.data.page;

      if (!req.redirectThisUrl && res) {
        req.redirectThisUrl = (url) => {
          res.redirect(url);
        }

        next();
      } else {
        next();
      }
    }

    const superServeGetPage = self.serveGetPage;
    self.serveGetPage = (req, callback) => {
      const pageData = req.data.page;
      console.log('serveGetPage', pageData)

      if (pageData && pageData.notLoggedInRedirect && !req.loggedIn) {
        req.redirectThisUrl(pageData.notLoggedInRedirect);
      }

      return superServeGetPage(req, callback);
    }

    const superServeLoaders = self.serveLoaders;
    self.serveLoaders = (req, callback) => {
      const pageData = req.data.page;
      console.log('superServeLoaders', pageData)

      if (pageData && pageData.notLoggedInRedirect && !req.loggedIn) {
        req.redirectThisUrl(pageData.notLoggedInRedirect);
      }

      return superServeLoaders(req, callback);
    }

    /*

    const superServeDeliver = self.serveDeliver;
    self.serveDeliver = (req, callback) => {
      const pageData = req.data.page;
      console.log('serveDeliver', pageData)

      if (pageData && pageData.notLoggedInRedirect && !req.loggedIn) {
        req.redirectThisUrl(pageData.notLoggedInRedirect);
      }

      return superServeDeliver(req, callback);
    }

    */
  }
};
