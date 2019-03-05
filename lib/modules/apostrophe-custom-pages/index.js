module.exports = {
  beforeConstruct: function(self, options) {
    options.addFields = [
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
      }
    ]
  },
};
