const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'List',
  addFields: [
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      titleField: 'item',
      schema: [
        {
          type: 'string',
          name: 'item',
          label: 'Item'
        },
      ]
    },
    {
      name: 'listClassName',
      type: 'select',
      label: 'Select appearance modus for list',
      choices: [
        {
          label: 'Bullets',
          value: 'uk-list uk-list-bullet',
        },
        {
          label: 'Checkmarks with blue background',
          value: 'checkmark-list',
        },
        {
          label: 'Blue Checkmarks',
          value: 'checkmark-blue-list',
        },
        {
          label: 'Stripes',
          value: 'uk-list uk-list-striped'
        }
      ]
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
