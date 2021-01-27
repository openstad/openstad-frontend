/**
 * Widget for displaying lists in several types of styling with static content
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
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
          titleField: 'subitem',
          schema: [
            {
              type: 'string',
              name: 'subitem',
              label: 'Subitem'
            },
          ]
        },
        {
          name: 'subListType',
          type: 'select',
          label: 'Select type of list',
          choices: [
            {
              label: 'Unordered list',
              value: 'ul'
            },
            {
              label: 'Ordered list',
              value: 'ol'
            }
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
            },
            {
              label: 'Numbers',
              value: 'uk-list uk-list-numbers'
            }
          ]
        },
      ]
    },
    {
      name: 'listType',
      type: 'select',
      label: 'Select type of list',
      choices: [
        {
          label: 'Unordered list',
          value: 'ul'
        },
        {
          label: 'Ordered list',
          value: 'ol'
        }
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
        },
        {
          label: 'Numbers',
          value: 'uk-list uk-list-numbers'
        }
      ]
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
       {
         name: 'generalGroup',
         label: 'General',
         fields: ['items']
       },
       {
         name: 'stylingGroup',
         label: 'Styling',
         fields: ['listType', 'listClassName', 'containerStyles']
       }
     ]);

    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        if (widget.containerStyles) {
          const containerId = widget._id;
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
