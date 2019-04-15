const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Title',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title ',
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Select appearance modus for title',
      choices: [
        {
          label: 'Heading 1',
          value: 'h1',
        },
        {
          label: 'Heading 2',
          value: 'h2',
        },
        {
          label: 'Heading 3',
          value: 'h3',
        },
        {
          label: 'Heading 4',
          value: 'h4',
        },
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
  }
};
