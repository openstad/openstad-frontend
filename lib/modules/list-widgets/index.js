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

        {
          name: 'subitems',
          label: 'Subitems',
          type: 'array',
          titleField: 'subitems',
          schema: [
            {
              type: 'string',
              name: 'subitem',
              label: 'Subitem'
            },
          ]
        },

        {
          name: 'subListClassName',
          type: 'select',
          label: 'Select appearance modus for subitems',
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
