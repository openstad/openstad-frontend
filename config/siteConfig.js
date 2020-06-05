const path = require('path');
const contentWidgets = require('./contentWidgets');
const palette = require('./palette');
const resourcesSchema = require('./resources.js').schemaFormat;

module.exports = {
  get: (site, siteData, openstadMap, openstadMapPolygons) => {

    const resources = siteData && siteData.resources ? siteData.resources : resourcesSchema;

    const siteConfig = {
      shortName: site._id,
      modules: {
        'api-proxy': {},
        'apostrophe-db': {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 27017,
        },
        'apostrophe-express': {
          port: process.env.PORT,
        },
        'apostrophe-docs': {
          //advisoryLockTimeout: 2
        },
        'openstad-widgets': {},
        'openstad-users': {},
        'openstad-auth': {},
        'openstad-login': {},
        'apostrophe-login': {
          localLogin: false
        },
        'apostrophe-multisite-fake-listener': {
          construct: function (self, options) {
            // Don't really listen for connections. We'll run as middleware
            // This is necessary for the multisite startup script
            self.apos.listen = function () {
              if (self.apos.options.afterListen) {
                return self.apos.options.afterListen(null);
              }
            }
          }
        },
        'apostrophe-attachments': {},
        'apostrophe-multisite-patch-assets': {},
        'openstad-nunjucks-filters': {},
        'settings': {
          // So we can write `apos.settings` in a template
          alias: 'settings',
          apiUrl: process.env.API,
          appUrl: process.env.APP_URL,
          apiLogoutUrl: process.env.API_LOGOUT_URL,
          openStadMap: openstadMap,
          openstadMapPolygons: openstadMapPolygons,
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
          siteConfig: siteData,
          contentWidgets: contentWidgets
        },

        // Apostrophe module configuration

        // Note: most configuration occurs in the respective
        // modules' directories. See lib/apostrophe-assets/index.js for an example.

        // However any modules that are not present by default in Apostrophe must at
        // least have a minimal configuration here: `moduleName: {}`

        // If a template is not found somewhere else, serve it from the top-level
        // `views/` folder of the project
        'apostrophe-templates': {viewsFolderFallback: path.join(__dirname, '../views')},
        'apostrophe-logger': {},
        'idea-pages': {},
        'apostrophe-pages': {},
        'apostrophe-global': {},
        'section-widgets': {},
        'all-on-one-row-widgets': {},
        'card-widgets': {},
        'iframe-widgets': {},
        'speech-bubble-widgets': {},
        'title-widgets': {},
        'main-image-widgets': {},
        'list-widgets': {},
        'agenda-widgets': {},
        'admin-widgets': {},
        'accordeon-widgets': {},
        'idea-overview-widgets': {},
        'icon-section-widgets': {},
        'idea-single-widgets': {},
        'idea-form-widgets': {},
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
        'arguments-widgets': {},
        'arguments-form-widgets': {},
        'gebiedsontwikkeling-tool-widgets': {},
        'user-form-widgets': {},
        'submissions-widgets': {},
        'participatory-budgeting-widgets': {},
        'begroot-widgets': {},
        'cookie-warning-widgets': {},
        'choices-guide-widgets': {},
        'local-video-widgets': {},
        'one-row-widgets': {},
        'image-widgets': {},
        'apostrophe-palette-widgets': {},
        'apostrophe-palette': {},
        'apostrophe-video-widgets': {},
        'location-widgets': {},
        'share-widgets': {},
        'recource-raw-widgets': {},
        'recource-image-widgets': {},
        'recource-like-widgets': {},
        'resource-admin-widgets' : {},
        'resource-pages' : {
          resources: resources
        },
        'resource-representation-widgets' : {
          resources: resources
        },
        'resource-overview-widgets' : {
          resources: resources
        },
        'resource-form-widgets' : {
          resources: resources
        },
        'apostrophe-palette-global': {
          paletteFields: palette.fields,
          arrangePaletteFields: palette.arrangeFields
        },
        'apostrophe-assets': {
          minify: process.env.MINIFY_JS && (process.env.MINIFY_JS == 1 || process.env.MINIFY_JS === 'ON'),
          // we set the option te lean, this means a lot of the JS libraries ApostrhopeCMS assumes exists are turned off
          // we manually included a few libs with Apos needs to functional
          // in future in might make sense to make a further seperate for admin users and normal users
        //  lean: false,
          jQuery: 3,
          scripts: [
          //  {name: 'jquery'},
        //    {name: 'react'},
        //    {name: 'react.dom'},
            /* Apos script */
    //        {name: 'apos/jquery.cookie'},
    //        {name: 'apos/jquery.json-call'},
            {name: 'cookies'},
            {name: 'site'},
            {name: 'shuffle.min'},
            {name: 'sort'},
            {name: 'jquery.dataTables.min'},
            {name: 'jquery.validate.min'},
            {name: 'jquery.validate.nl'},
          ],
          stylesheets: [
            {name: 'main'}
          ],
        },
        'info-bar-widgets': {},
        'apostrophe-area-structure': {},
        'vimeo-upload': {}
      }
    };

    // can turn on workflow per site, but WARNING this only works for DEV sites currently,
    // the assets generation will include or exclude certain files breaking the CMS
    const useAposWorkflow = siteData.cms && siteData.cms.aposWorkflow;
    const turnOffWorkflow = siteData.cms && siteData.cms.turnOffWorkflow;

    // If apostrophe workflow is turned o
    if ((process.env.APOS_WORKFLOW === 'ON' || useAposWorkflow) && !turnOffWorkflow) {
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
            ]
          },
        ],
        defaultLocale: 'default'
      };

      siteConfig.modules['apostrophe-workflow-modified-documents'] = {};

    } else {
      siteConfig.modules['apostrophe-i18n'] = {
        locales: ['nl', 'en'],
        directory: __dirname + '/locales',
        defaultLocale: 'nl'
      }
    }

    return siteConfig;
  }
}
