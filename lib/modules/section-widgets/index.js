const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Column Section',
  addFields: [
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',
      required: true
    },
    {
      name: 'displayType',
      label: 'Type',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'One column',
          value: 'columns-one',
        },
        {
          label: 'Half half columns',
          value: 'columns-half',
        },
        {
          label: 'Three columns',
          value: 'columns-three',
        },
        {
          label: 'Four columns',
          value: 'columns-four',
        },
        {
          label: 'Twothird columns',
          value: 'columns-twothird',
        },
      /*  {
          label: 'icons',
          value: 'icons',
        }, */
      ]
    },
    {
      name: 'area1',
      type: 'area',
      label: 'Area 1',
      contextual: true
    },
    {
      name: 'area2',
      type: 'area',
      label: 'Area 2',
      contextual: true
    },
    {
      name: 'area3',
      type: 'area',
      label: 'Area 3',
      contextual: true
    },
    {
      name: 'area4',
      type: 'area',
      label: 'Area 4',
      contextual: true
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
