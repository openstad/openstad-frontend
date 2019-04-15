const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Icon section',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      required: true
    },
    {
      name: 'steps',
      type: 'array',
      titleField: 'title',
      schema: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          type: 'string',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          type: 'string',
          textarea: true
        },
        {
          name: 'image',
          type: 'attachment',
          label: 'Image',
          svgImages: true,
        },
        {
          name: 'imageHeight',
          type: 'string',
          label: 'Image height',
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: 'Link URL',
          type: 'string',
        },
        {
          name: 'linkTitle',
          type: 'text',
          label: 'Link title',
          type: 'string',
        },
      ]
    },
    {
      name: 'imageHeight',
      type: 'string',
      label: 'Image Height',
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
         widget.formattedContainerStyles = widget.containerStyles ? styleSchema.format(widget.containerStyles) : '';
      });

      return superLoad(req, widgets, callback);
    }

     var superPushAssets = self.pushAssets;
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
  }
};
