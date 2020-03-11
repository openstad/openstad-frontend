// This configures the apostrophe-users module to add an admin-level
// group by default:

/**
 * Custom permissions:
 * - add-sections
 * -
 * -

module.exports = {
  groups: [
   {
      title: 'guest',
      permissions: [ ]
    },
    {
      title: 'editor',
      permissions: [
        'edit',
        'private-locales',
        'edit-apostrophe-file',
        'edit-workflow-document',
        'guest',
        'admin-apostrophe-page'
      ],
    permissionsLocales: {
        guest: {},
        edit: { default: true, 'default-draft': true },
       'private-locales': {},
       'edit-apostrophe-page': { default: false, 'default-draft': true },
       'edit-apostrophe-file': {},
       'edit-workflow-document': {}
     }
    },
    {
      title: 'admin',
      permissions: [ 'admin' ]
    }
  ]
};

*/
