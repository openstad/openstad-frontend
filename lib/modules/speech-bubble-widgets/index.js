const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Speech Bubble',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      required: true
    },
    {
      name: 'displayLink',
      type: 'boolean',
      label: 'Display link',
      choices: [
        {
          value: true,
          label: "Display",
          showFields: [
            'linkLabel', 'link'
          ]
        },
        {
          value: false,
          label: "Hide"
        },
      ]
    },
    {
      name: 'linkLabel',
      type: 'string',
      label: 'Label',
      required: false
    },
    {
      name: 'link',
      type: 'string',
      label: 'Link',
      required: false
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
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
  }
};
