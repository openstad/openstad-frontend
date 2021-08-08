// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

const loadIdeas       = require('./lib/load-ideas');
const loadTags        = require('./lib/load-tags');

module.exports = {
    improve: 'apostrophe-pages',
    types: [
      {
        name: 'default',
        label: 'Default'
      },
      {
        name: 'resource',
        label: 'Resource'
      },
      {
        name: 'idea',
        label: 'Idea (Deprecated, please use Resource and set resource to Idea)'
      },
      {
        name: 'home',
        label: 'Home'
      },
    ],
    construct : function (self, options) {

      require('./lib/api.js')(self, options);
      require('./lib/middlewares.js')(self, options);


      /**
       * Add button to admin menu to clear cache
       */
      self.apos.adminBar.add('openstad-clear-cache', 'Clear Cache')

      /**
       * Add script that handles the clear cache options
       */
      const superPushAssets = self.pushAssets;
      self.pushAssets = () => {
        superPushAssets();
        self.pushAsset('script', 'clear-cache', { when: 'always' });
      };

      // set return options to the data object, it's a bit shorter then these long getOption function calls
      self.apos.app.use((req, res, next) => {
        req.data.csrf = self.apos.settings.getOption(req, 'csrf');
        req.data.apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        req.data.appUrl = self.apos.settings.getOption(req, 'appUrl');
        req.data.cmsUrl = self.apos.settings.getOption(req, 'siteUrl');
        req.data.googleMapsApiKey =  self.apos.settings.getOption(req, 'googleMapsApiKey');
        next();
      });


      // load api resources we want available on every page
      // they are cached
      self.apos.app.use((req, res, next) => { loadIdeas(req, res, next); });
      self.apos.app.use((req, res, next) => { loadTags(req, res, next);  });

      const superPageBeforeSend = self.pageBeforeSend;
      self.pageBeforeSend = (req, callback) => {

        /**
         * Allow pages to redirect if not logged in
         * Redirect in seperate function doesnt block execution flow therefore causing header already set error
         */
        const pageData = req.data.page;

        if (pageData && pageData.notLoggedInRedirect && !req.data.loggedIn) {
          return req.res.redirect(pageData.notLoggedInRedirect);
        }

        self.setActiveIdeaId(req);
        self.addRankingToIdeas(req);

        req.data.messages =  {
          success: req.flash('success'),
          error: req.flash('error'),
          info: req.flash('info'),
        }

        return superPageBeforeSend(req, callback);
      };


    }
};
