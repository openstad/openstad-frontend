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
