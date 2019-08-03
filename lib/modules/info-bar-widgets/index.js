const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Info bar',
  addFields: [
    {
      name: 'message',
      label: 'Message',
      type: 'string',
      required: true
    },
    {
      name: 'removable',
      label: 'Removable',
      type: 'boolean',
      required: true
    },
    {
      name: 'backgroundColor',
      label: 'backgroundColor',
      type: 'color',
      required: false
    },
    styleSchema.definition('containerStyles', 'Styles')
  ],
  construct: function(self, options) {
    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      self.pushAsset('script', 'main', { when: 'always' });
    };

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

  }
};
