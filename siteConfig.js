const path = require('path');

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
        'auth': {},
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
          contentWidgets: {
            'agenda': {},
            'admin': {},
            'accordeon': {},
            'arguments': {},
            'arguments-form': {},
            'section': {
              addLabel: 'Columns',
              controls: {
                movable: true,
                removable: true,
                position: 'bottom-left'
              },
            },
            'slider': {},
            'counter': {
              addLabel: 'Counter',
            },
            'date-bar': {},
            'idea-form': {},
            'idea-map': {},
            'idea-overview': {},
            'idea-single': {},
            'ideas-on-map': {
              addLabel: 'Ideeen op een kaart',
            },
            'iframe': {},
            'header': {},
            'image': {},
            'info-bar': {},
            'link': {},
            'list': {},
            'gebiedsontwikkeling-tool': {
              addLabel: 'Map for area development',
            },
            'begroot': {
              addLabel: 'Participatory budgetting',
            },
            'main-image': {},
            'apostrophe-rich-text': {
              toolbar: ['Styles', 'Bold', 'Italic', 'Link', 'Unlink', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',],
              styles: [
                {name: 'Paragraph', element: 'p'}
              ],
              controls: {
                movable: true,
                removable: true,
                position: 'top-left'
              }
            },

            'speech-bubble': {
              controls: {
                position: 'top-left'
              },
            },
            'title': {},
            'user-form': {},
            'local-video': {
              addLabel: 'Video (upload)',
            },
            'apostrophe-video': {
              addLabel: 'Video (3d party, youtube, vimeo, etc.)',
            },

          }
        },

        // Apostrophe module configuration

        // Note: most configuration occurs in the respective
        // modules' directories. See lib/apostrophe-assets/index.js for an example.

        // However any modules that are not present by default in Apostrophe must at
        // least have a minimal configuration here: `moduleName: {}`

        // If a template is not found somewhere else, serve it from the top-level
        // `views/` folder of the project
        'apostrophe-templates': {viewsFolderFallback: path.join(__dirname, 'views')},
        'idea-pages': {},
        'apostrophe-pages': {
          types: [
            {
              name: 'default',
              label: 'Default'
            },
            {
              name: 'idea',
              label: 'Idea'
            },
            {
              name: 'home',
              label: 'Home'
            },
          ]
        },
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
        'begroot-widgets': {},
        'local-video-widgets': {},
        'one-row-widgets': {},
        'image-widgets': {},
        'apostrophe-palette-widgets': {},
        'apostrophe-palette': {},
        'apostrophe-video-widgets': {},
        'apostrophe-palette-global': {
          paletteFields: [
            {
              name: 'backgroundNavColor',
              label: 'Background color of the navigation bar',
              type: 'color',
              selector: '#navbar',
              property: 'background-color',
            },
            {
              name: 'textNavColor',
              label: 'Text color of the items in the navigation bar',
              type: 'color',
              selector: '#navbar a',
              property: 'color',
            },
            {
              name: 'textHoverNavColor',
              label: 'Text color when hovering over the items in the navigation bar',
              type: 'color',
              selector: '#navbar a:hover',
              property: 'color',
            },
            {
              name: 'textLineNavColor',
              label: 'Color of the underline of the items in the navigation bar',
              type: 'color',
              unit: '!important',
              selector: '#mainMenu .nav-link',
              property: 'border-color',
            },
            {
              name: 'backgroundFooterColor',
              label: 'Background color of the footer',
              type: 'color',
              selector: 'footer',
              property: 'background-color',
            },
            {
              name: 'textFooterColor',
              label: 'Color of the text in the footer',
              type: 'color',
              selector: ['footer .container h2', 'footer .container p', 'footer .container a'],
              property: 'color',
            },
            {
              name: 'logoWidth',
              label: 'Logo breedte',
              type: 'range',
              selector: ['#logo-image'],
              property: ['width'],
              min: 25,
              max: 300,
              step: 1,
              unit: 'px',
              //      mediaQuery: '(max-width: 59.99em)'
            },
          ],
          arrangePaletteFields: [
            {
              name: 'colorFields',
              label: 'Kleuren',
              fields: ['backgroundNavColor', 'textNavColor', 'textHoverNavColor', 'textLineNavColor', 'backgroundFooterColor', 'textFooterColor']
            },
            {
              name: 'logoFields',
              label: 'Logo instellingen',
              fields: ['logoWidth']
            },
          ]
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

    siteConfig.configureNunjucks = function (env) {
      env.addFilter('repeat', function (s, n) {
        var r = '';
        while (n--) {
          r += s;
        }
        return r;
      });
    }

    return siteConfig;
  }
}
