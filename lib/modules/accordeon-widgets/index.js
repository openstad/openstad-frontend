const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Accordeon',
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
          label: 'Description',
          textarea: true
        }
      ]
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    const superLoad = self.load;

    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        if (widget.containerStyles) {
          const containerId = styleSchema.generateId();
          widget.containerId = containerId;
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }
      });

      return superLoad(req, widgets, callback);
    }


     var superPushAssets = self.pushAssets;
     self.pushAssets = () => {
       superPushAssets();
       self.pushAsset('stylesheet', 'accordeon', { when: 'always' });
       self.pushAsset('script', 'accordeon', { when: 'always' });
     };
  }
};
