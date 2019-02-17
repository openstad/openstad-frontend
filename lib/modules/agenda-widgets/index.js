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
          label: 'Title',
          textarea: true
        },
        {
          type: 'string',
          name: 'actionText',
          label: 'Description'
        },
        {
          type: 'boolean',
          name: 'period',
          label: 'Is period'
        },
      ]
    },
  ],
  construct: function(self, options) {
     var superPushAssets = self.pushAssets;
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
  }
};
