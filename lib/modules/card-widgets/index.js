module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Card',
  addFields: [
    {
      name: 'cardTitle',
      type: 'string',
      label: 'Title',
      required: true
    },
    {
      name: 'cardDescription',
      type: 'text',
      label: 'Description',
      type: 'string',
      textarea: true
    },
    {
      name: 'cardImage',
      type: 'attachment',
      label: 'Image',
      required: true,
      trash: true
    },
    {
      name: 'cardNumber',
      type: 'string',
      label: 'Card number',
      required: false
    },
    {
      name: 'cardLink',
      type: 'string',
      label: 'Link tekst',
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
