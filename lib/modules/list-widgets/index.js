module.exports = {
  extend: 'apostrophe-widgets',
  label: 'List',
  addFields: [
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      titleField: 'Items',
      schema: [
        {
          type: 'string',
          name: 'item',
          label: 'Item'
        },
      ]
    },
    {
      name: 'listClassName',
      type: 'select',
      label: 'Select appearance modus for list',
      choices: [
        {
          label: 'Bullets',
          value: 'uk-list uk-list-bullet',
        },
        {
          label: 'Checkmarks',
          value: 'checkmark-list',
        },
        {
          label: 'Stripes',
          value: 'uk-list uk-list-striped'
        }
      ]
    },

  ]
};
