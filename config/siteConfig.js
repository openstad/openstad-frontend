const path = require('path');
const contentWidgets = require('./contentWidgets');
const palette = require('./palette');

module.exports = {
  get: (site, siteData, openstadMap, openstadMapPolygons) => {

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
        'apostrophe-docs': {},
        'openstad-auth': {},
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
        'header-widgets': {},
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
        'date-bar-widgets': {},
        'map-widgets': {},
        'idea-map-widgets': {},
        'link-widgets': {},
        'counter-widgets': {},
        'slider-widgets': {},
        'arguments-widgets': {},
        'arguments-form-widgets': {},
        'gebiedsontwikkeling-tool-widgets': {},
        'user-form-widgets': {},
        'submissions-widgets': {},
        'participatory-budgeting-widgets': {},
        'begroot-widgets': {},
        'local-video-widgets': {},
        'one-row-widgets': {},
        'image-widgets': {},
        'apostrophe-palette-widgets': {},
        'apostrophe-palette': {},
        'apostrophe-video-widgets': {},
        'apostrophe-palette-global': {
          paletteFields: palette.fields,
          arrangePaletteFields: palette.arrangeFields
        },
        'apostrophe-assets': {
          minify: process.env.MINIFY_JS && (process.env.MINIFY_JS == 1 || process.env.MINIFY_JS === 'ON'),
          scripts: [
            {name: 'cookies'},
            {name: 'site'},
            {name: 'shuffle.min'},
            {name: 'sort'},
            {name: 'jquery.validate.min'},
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
      }
    };

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
