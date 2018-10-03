module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Agenda',
  addFields: [
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      titleField: 'Items',
      schema: [
        {
          type: 'string',
          name: 'description',
          label: 'Description',
          textarea: true
        },
        {
          type: 'string',
          name: 'actionText',
          label: 'Action Text'
        },
        {
          type: 'string',
          name: 'actionURL',
          label: 'Action URL'
        },
        {
          type: 'boolean',
          name: 'period',
          label: 'Is period'
        },
      ]
    },
  ]
};
