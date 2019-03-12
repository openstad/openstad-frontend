module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Agenda',
  addFields: [
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      titleField: 'title',
      schema: [
        {
          type: 'string',
          name: 'title',
          label: 'Title'
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
