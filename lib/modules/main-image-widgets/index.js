const styleSchema = require('../../../config/styleSchema.js').default;
//const styleFormat = require('../../../config/styleSchema.js').format;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Main Image',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title ',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description ',
      textarea: true
    },
    {
      name: 'image',
      type: 'attachment',
      label: 'Image ',
    },
    styleSchema.definition('containerStyles', 'Styles for the container'),
    styleSchema.definition('textContainerStyles', 'Styles for text banner'),
  ],
/*   stylesheets: [
    {
      name: 'site'
    }
  ],*/
 construct: function(self, options) {
    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main-image', { when: 'always' });
    };

    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
         widget.formattedContainerStyles = widget.containerStyles ? styleSchema.format(widget.containerStyles) : '';
         widget.formattedTextContainerStyles = widget.textContainerStyles ? styleSchema.format(widget.textContainerStyles) : '';
      });

      return superLoad(req, widgets, callback);
    }
  }
};
