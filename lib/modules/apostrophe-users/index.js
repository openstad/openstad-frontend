// This configures the apostrophe-users module to add an admin-level
// group by default:

/**
 * Custom permissions:
 * - add-sections
 * -
 * -
 */

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
      ]

      /*{
        edit: true,
        'private-locales': true,
        'edit-apostrophe-file': true,
        'edit-workflow-document': true,
        guest: true
      }*/
    },
    {
      title: 'admin',
      permissions: [ 'admin' ]
    }
  ]
};
