/**
 * A widget that allows for displaying an accordeon, made with static content
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
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
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'generalGroup',
        label: 'General',
        fields: ['items']
      },
      {
        name: 'stylingGroup',
        label: 'Styling',
        fields: ['containerStyles']
      }
    ]);

    const superLoad = self.load;

    self.load = (req, widgets, callback) => {
      widgets.forEach((widget) => {
        if (widget.containerStyles) {
          const containerId = self.apos.utils.generateId();
          widget.containerId = containerId;
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }

        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';

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
