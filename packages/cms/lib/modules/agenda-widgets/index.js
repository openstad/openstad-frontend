/**
 * A widget that allows for displaying an agenda timeline, made with static content
 */

const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Agenda',
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
          label: 'Title',
          help: `For example: 'March 8th'`,
        },
        {
          type: 'string',
          name: 'actionText',
          label: 'Description'
        },
        {
          type: 'select',
          name: 'period',
          label: 'Period or moment',
          help: 'A period (from one point to another point in time) and a moment (one point in time) have a different visualisation',
          choices: [
            {
              value: 'period',
              label: 'Period'
            },
            {
              value: 'moment',
              label: 'Moment'
            },
          ]
        },
      ]
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    const superLoad = self.load;

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
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
  }
};
