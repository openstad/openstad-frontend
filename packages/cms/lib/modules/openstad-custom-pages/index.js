/**
 * Module that adds custom fields in the page settings view
 */
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
        name: 'extraMetaTags',
        label: 'Extra Meta Tags',
        type: 'string',
        textarea: true
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
        name: 'accountPresentRedirect',
        type: 'string',
        label: 'Redirect from account create page to other page if account is present',
      },
      {
        name: 'userPresentRedirect',
        type: 'string',
        label: 'Redirect to other page if user is present',
      },
      {
        name: 'userHasActiveSubscriptionRedirect',
        type: 'string',
        label: 'Redirect to other page if user has active subscription',
      },
      {
        name: 'userWitEmailPresentRedirect',
        type: 'string',
        label: 'Redirect from user create page to other page if user is present with email',
      },
      {
        name: 'userNotOrNotEmailPresentRedirect',
        type: 'string',
        label: 'Redirect to page if user doesnt exists or has no email',
      },
      {
        name: 'userNotPresentRedirect',
        type: 'string',
        label: 'Redirect from to page if user doesn\'t exists, for instance to user create form',
      },
      {
        name: 'accountNeededRedirect',
        type: 'string',
        label: 'Redirect to account page if required',
      },
      {
        name: 'activeAccountRequiredRedirect',
        type: 'string',
        label: 'Active account required (if not empty will redirect to string)',
      },
      {
        name: 'noCSS',
        type: 'boolean',
        label: 'No CSS for non-cms users?',
      },
      {
        name: 'hideHeader',
        type: 'boolean',
        label: 'Hide the header?',
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
      {
        name: 'htmlClass',
        type: 'string',
        label: 'Set html class to your page body',
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
