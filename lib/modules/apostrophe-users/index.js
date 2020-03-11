// This configures the apostrophe-users module to add an admin-level
// group by default:

/**
 * Custom permissions:
 * - add-sections
 * -
 * -
 * */

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
        'edit-apostrophe-page'
      ]
    },
    {
      title: 'admin',
      permissions: [ 'admin' ]
    }
  ]
};
