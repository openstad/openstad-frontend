const resourcesSchema = require('../../../config/resources.js').schemaFormat;
Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};

module.exports = {
  improve: 'apostrophe-custom-pages',
  arrangeFields: [{
    name: 'basics',
    label: 'Basics',
    fields: [ 'title', 'slug', 'type', 'resource', 'notLoggedInRedirect', 'published']
  },
  {
    name: 'meta',
    label: 'Meta settings',
    fields: ['metaTitle', 'metaDescription', 'metaTags']
  }],
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
        label: 'Redirect user when not logged in',
      },
      {
        name: 'anonymousUserRequired',
        type: 'string',
        label: 'Redirect to create anonymous user',
      },
      {
        name: 'accountNeededRedirect',
        type: 'string',
        label: 'Redirect to account page if required',
      },
      {
        name: 'hideHeader',
        type: 'boolean',
        label: 'Hide the header??',
      },
      {
        name: 'hideNavigation',
        type: 'boolean',
        label: 'Hide the navigation?',
      },
      {
        name: 'hideFooter',
        type: 'boolean',
        label: 'Hide the footer?',
      },
      {
        name: 'cookieBarFixed',
        type: 'boolean',
        label: 'Set the cookiebar fixed at the footer?',
        def: false,
      },



    ];

    //if loaded from options then the siteconfig from api overwrites the standard available resources
    if (options.resources) {
      self.resources = options.resources;

      options.addFields = [
        {
          type: 'select',
          name: 'resource',
          label: 'Resource',
          choices : options.resources
        }
      ].concat(options.addFields || [])
    }


  //  options.arrangeFields

  }
};
