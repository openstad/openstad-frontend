const path = require('path');
const contentWidgets = require('./contentWidgets');
const palette = require('./palette');
const resourcesSchema = require('./resources.js').schemaFormat;

module.exports = {
  get: (shortName, siteData, assetsIdentifier) => {
    const resources =
      siteData && siteData.resources ? siteData.resources : resourcesSchema;
    const siteUrl =
      siteData && siteData.cms && siteData.cms.url ? siteData.cms.url : false;

    const siteConfig = {
      shortName: shortName,
      prefix: siteData.sitePrefix ? '/' + siteData.sitePrefix : false,
      modules: {
        'api-proxy': {
          sitePrefix: siteData.sitePrefix ? '/' + siteData.sitePrefix : false,
        },
        'image-proxy': {
          sitePrefix: siteData.sitePrefix ? '/' + siteData.sitePrefix : false,
        },
        'openstad-assets': {
          minify:
            process.env.MINIFY_JS &&
            (process.env.MINIFY_JS == 1 || process.env.MINIFY_JS === 'ON'),
          jQuery: 3,
          //lean: true,
          scripts: [
            { name: 'cookies' },
            { name: 'site' },
            { name: 'shuffle.min' },
            { name: 'sort' },
            { name: 'jquery.validate.min' },
            { name: 'jquery.validate.nl' },
            { name: 'jquery.dataTables.min' },
          ],
          stylesheets: [{ name: 'main' }],
        },
        settings: {
          ignoreNoCodeWarning: true,
          // So we can write `apos.settings` in a template
          alias: 'settings',
          siteUrl: siteUrl,
          apiUrl: process.env.API,
          appUrl: process.env.APP_URL,
          oAuthUrl: process.env.OAUTH_URL,
          apiLogoutUrl: process.env.API_LOGOUT_URL,
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
          siteConfig: siteData,
          oAuthConfig: siteData && siteData.oauth ? siteData.oauth : [],
          contentWidgets: contentWidgets,
        },
        'apostrophe-db': {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 27017,
        },
        'apostrophe-express': {
          port: process.env.PORT,
          session: {
            // If this still says `undefined`, set a real secret!
            secret: process.env.SESSION_SECRET,
            cookie: {
              path: '/',
              httpOnly: true,
              secure: process.env.COOKIE_SECURE_OFF === 'yes' ? false : true,
              // Default login lifetime between requests is one day
              maxAge: process.env.COOKIE_MAX_AGE || 86400000,
            },
          },
          csrf: {
            exceptions: [
              //     '/modules/arguments-form-widgets/submit',
              //     '/modules/user-form-widgets/submit',
              //     '/modules/idea-form-widgets/submit',
              '/image',
              '/images',
              '/video-api',
              '/vimeo-upload',
              '/attachment-upload',
              '/fetch-image',
              '/api/site/167/newslettersignup',
              '/api/site/*/newslettersignup',
              //     '/api/site/*/vote/*/toggle',

              //     '/vote',
              //     '/api/**'
            ],
          },
        },
        'apostrophe-login': {
          localLogin: false,
        },
        'apostrophe-multisite-fake-listener': {
          construct: function (self, options) {
            // Don't really listen for connections. We'll run as middleware
            // This is necessary for the multisite startup script
            self.apos.listen = function () {
              if (self.apos.options.afterListen) {
                return self.apos.options.afterListen(null);
              }
            };
          },
        },
        'apostrophe-multisite-patch-assets': {
          construct: function (self, options) {
            // For dev: at least one site has already started up, which
            // means assets have already been attended to. Steal its
            // asset generation identifier so they don't fight.
            // We're not too late because apostrophe-assets doesn't
            // use this information until afterInit
            const superDetermineDevGeneration =
              self.apos.assets.determineDevGeneration;
            self.apos.assets.determineDevGeneration = function () {
              const original = superDetermineDevGeneration();
              return assetsIdentifier ? assetsIdentifier : original;
            };
          },
        },
        'apostrophe-palette-global': {
          paletteFields: palette.fields,
          arrangePaletteFields: palette.arrangeFields,
        },
        'apostrophe-palette-widgets': {},
        'apostrophe-palette': {},
        'openstad-admin-bar': {},
        'openstad-video-widgets': {},
        'apostrophe-area-structure': {},
        'openstad-areas': {},
        'openstad-captcha': {},
        'openstad-widgets': {},
        'openstad-users': {},
        'openstad-basic-auth': {},
        'openstad-auth': {},
        'openstad-template-cache': {},
        'openstad-login': {},
        'openstad-api': {
          siteUrl: siteUrl,
        },
        'openstad-pages': {},
        'openstad-global': {},
        'openstad-attachments': {},
        'attachment-upload': {},

        'openstad-nunjucks-filters': {
          siteUrl: siteUrl,
        },
        'openstad-custom-pages': {},
        'openstad-oembed': {
          endpoints: [
            {
              domain: 'vimeo.com',
              endpoint: 'https://vimeo.com/api/oembed.json',
            },
          ],
        },

        // Apostrophe module configuration

        // Note: most configuration occurs in the respective
        // modules' directories. See lib/apostrophe-assets/index.js for an example.

        // However any modules that are not present by default in Apostrophe must at
        // least have a minimal configuration here: `moduleName: {}`

        // If a template is not found somewhere else, serve it from the top-level
        // `views/` folder of the project
        'openstad-templates': {
          viewsFolderFallback: path.join(__dirname, '../views'),
        },
        'openstad-rich-text-widgets': {},
        'openstad-logger': {},
        'idea-pages': {},
        'section-widgets': {},
        'card-widgets': {},
        'iframe-widgets': {},
        'speech-bubble-widgets': {},
        'title-widgets': {},
        'list-widgets': {},
        'agenda-widgets': {},
        'admin-widgets': {},
        'accordeon-widgets': {},
        'idea-overview-widgets': {},
        'icon-section-widgets': {},
        'idea-single-widgets': {},
        'idea-form-widgets': {
          sitePrefix: siteData.sitePrefix ? siteData.sitePrefix : false,
        },
        'ideas-on-map-widgets': {},
        'choices-guide-result-widgets': {},
        'previous-next-button-block-widgets': {},
        'date-bar-widgets': {},
        'map-widgets': {},
        'idea-map-widgets': {},
        'link-widgets': {},
        'counter-widgets': {},
        'slider-widgets': {},
        'cookie-warning-widgets': {},
        'arguments-block-widgets': {},
        'arguments-form-widgets': {},
        'arguments-widgets': {},
       'user-form-widgets': {},
        'openstad-user-remove-widgets' : {},
        'submissions-widgets': {},
        'participatory-budgeting-widgets': {},
        'begroot-widgets': {},
        'choices-guide-widgets': {},
        'local-video-widgets': {},
        'image-widgets': {},
        'location-widgets': {},
        'share-widgets': {},
        'recource-raw-widgets': {},
        'recource-image-widgets': {},
        'recource-like-widgets': {},
        'resource-admin-widgets': {},
        'resource-pages': {
          resources: resources,
        },
        'resource-representation-widgets': {
          resources: resources,
        },
        'resource-overview-widgets': {
          resources: resources,
        },
        'resource-form-widgets': {
          resources: resources,
        },

        'info-bar-widgets': {},

        'vimeo-upload': {},
        'decision-tree-widgets': {}
      },
    };

    // can turn on workflow per site, but WARNING this only works for DEV sites currently,
    // the assets generation will include or exclude certain files breaking the CMS
    const useAposWorkflow = siteData.cms && siteData.cms.aposWorkflow;
    const turnOffWorkflow = siteData.cms && siteData.cms.turnOffWorkflow;

    // If apostrophe workflow is turned o
    if (
      (process.env.APOS_WORKFLOW === 'ON' || useAposWorkflow) &&
      !turnOffWorkflow
    ) {
      siteConfig.modules['apostrophe-workflow'] = {
        // IMPORTANT: if you follow the examples below,
        // be sure to set this so the templates work
        alias: 'workflow',
        // Recommended to save database space. You can still
        // export explicitly between locales
        replicateAcrossLocales: true,
        permission: false,
        locales: [
          {
            name: 'default',
            label: 'Default',
            private: false,
            children: [
              /*  {
                name: 'nl',
                label: 'Nederlands',
                private: false,

              },
            {
            name: 'en',
                label: 'England'
              }*/
            ],
          },
        ],
        defaultLocale: 'default',
      };

      siteConfig.modules['apostrophe-workflow-modified-documents'] = {};
    } else {
      siteConfig.modules['apostrophe-i18n'] = {
        locales: ['nl', 'en'],
        directory: __dirname + '/locales',
        defaultLocale: 'nl',
      };
    }

    if (process.env.APOS_PROFILER === 'per-request') {
      siteConfig.modules['apostrophe-profiler'] = {};
    }

    if (process.env.S3_ENDPOINT){
      const s3Config = {
        storage: 's3',
        // Add an arbitrary S3 compatible endpoint
        endpoint: process.env.S3_ENDPOINT,
        // Get your credentials at aws.amazon.com/digitalocean
        secret: process.env.S3_SECRET,
        key: process.env.S3_KEY,
        // You need to create your bucket first before using it here
        bucket: process.env.S3_BUCKET,
        //  region: 'external-1',
      }

      if (process.env.S3_REGION) {
        s3Config.region = process.env.S3_REGION;
      }

      siteConfig.modules['apostrophe-attachments'] = {
        uploadfs: s3Config
      };
    }

    return siteConfig;
  },
};
