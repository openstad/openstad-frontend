const styleSchema = require('../../../config/styleSchema.js').default;
const resourcesSchema = require('../../../config/resources.js').schemaFormat;

const fields = [
  {
    name: 'displayType',
    label: 'Representation',
    type: 'select',
    choices: [
      {
        'label': 'Idea Page (only for idea resource)',
        'value': 'idea-page',
      },
      {
        'label': 'Title',
        'value': 'title',
      },
      {
        'label': 'Description',
        'value': 'description',
      },
      {
        'label': 'Summary',
        'value': 'summary',
      },
      {
        'label': 'Standard Information overview (title, category, date, summary, description)',
        'value': 'information-overview',
      },
      {
        'label': 'Website & address info',
        'value': 'website-address',
      },
      {
        'label': 'Help needed',
        'value': 'help-needed',
      }
    ]
  },
  styleSchema.definition('containerStyles', 'Styles for the container'),
]

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Resource representation',
  addFields: fields,

  construct: function(self, options) {
      const superLoad = self.load;
      self.load = function (req, widgets, next) {
        widgets.forEach((widget) => {
          // render string with variables. Add active recource
          if (widget.containerStyles) {
            const containerId = styleSchema.generateId();
            widget.containerId = containerId;
            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
        });

        return superLoad(req, widgets, next);
      }

      const superOutput = self.output;
      self.output = function(widget, options) {
        console.log('widget.page', widget.page);

        return superOutput(widget, options);
      };
  }
};
