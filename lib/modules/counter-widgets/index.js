module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Counter',
  addFields: [
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true
    },
    {
      name: 'url',
      type: 'string',
      label: 'Url',
      required: true
    },
    {
      name: 'dynamicCounter',
      type: 'select',
      label: 'Select dynamic counter',
      choices: [
        {
          label: 'Vote count',
          value: 'voteCount',
        },
        {
          label: 'Arguments count',
          value: 'argumentsCount',
        },
        {
          label: 'Static count',
          value: 'staticCount',
        },
      ]
    },
    {
      name: 'staticCount',
      type: 'string',
      label: 'Static count',
      required: false
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
