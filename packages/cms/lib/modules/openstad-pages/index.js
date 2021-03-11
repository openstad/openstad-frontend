// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

const loadIdeas           = require('./lib/load-ideas');
const loadTags            = require('./lib/load-tags');
const loadProducts        = require('./lib/load-products');

const url = require('url');

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
      self.apos.app.use((req, res, next) => { loadProducts(req, res, next);  });

      const superPageBeforeSend = self.pageBeforeSend;
      self.pageBeforeSend = (req, callback) => {

        /**
         * Allow pages to redirect if not logged in
         * Redirect in seperate function doesnt block execution flow therefore causing header already set error
         */
         const pageData = req.data.page;

         const thisHost = req.headers['x-forwarded-host'] || req.get('host');
         const protocol = req.headers['x-forwarded-proto'] || req.protocol;
         const siteUrl = protocol + '://' + thisHost;
         const fullUrl = siteUrl + req.originalUrl;
         const parsedUrl = url.parse(fullUrl, true);

         if (pageData && pageData.noCSS && !req.user) {
           // the when parameter is used by Apos to determine which assets is loaded
           // by forcing it to none will not find a used one
           req.data.dontAddAposCSS = true;
         }

         console.log('lets go req.url', req.url, req.data.when)

        if (pageData && pageData.notLoggedInRedirect && !req.data.loggedIn) {
          return req.res.redirect(pageData.notLoggedInRedirect);
        }

        if (pageData && pageData.anonymousUserRequired && !req.data.openstadUser) {
          return req.res.redirect('/oauth/login?useOauth=anonymous&returnTo=' + encodeURIComponent(parsedUrl.path));
        }

        if (pageData && pageData.accountNeededRedirect && !req.user.account) {
          return req.res.redirect(pageData.accountNeededRedirect);
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
