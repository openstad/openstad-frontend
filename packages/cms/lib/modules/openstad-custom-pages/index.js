const resourcesSchema = require('../../../config/resources.js').schemaFormat;

module.exports = {
  improve: 'apostrophe-custom-pages',
  beforeConstruct: function(self, options) {

    options.addFields = [
      {
        name: 'metaTitle',
        label: 'Meta title',
        type: 'string'
      },
      {
        name: 'metaDescription',
        label: 'Meta Description',
        type: 'string'
      },
      {
        name: 'metaTags',
        label: 'Meta Tags',
        type: 'string'
      },
      {
        name: 'notLoggedInRedirect',
        type: 'string',
        label: 'Redirect de gebruiker wanneer niet ingelogd',
      },
      {
        name: 'hideFooter',
        type: 'boolean',
        label: 'Hide the footer?',
      },
    ];

    //if loaded from options then the siteconfig from api overwrites the standard available resources
    if (options.resources) {
      self.resources = options.resources;

      options.addFields = [
        {
          type: 'select',
          name: 'resource',
          label: 'Resource (from config)',
          choices : options.resources
        }
      ].concat(options.addFields || [])
    }

  },
};
