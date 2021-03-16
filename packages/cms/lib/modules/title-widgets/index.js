/**
 * A widget for display a title with static content
 * 
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
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
    {
      name: 'className',
      type: 'select',
      label: 'Select HTML styling class',
      choices: [
        {
          label: 'Default',
          value: 'headerDefault',
        },
        {
          label: 'Heavy bold',
          value: 'heavyBold',
        },
      ]
    },
    {
      name: 'classNameCustom',
      type: 'string',
      label: 'Set Custom classname',
    },
    styleSchema.definition('containerStyles', 'Styles for the container'),
    styleSchema.getHelperClassesField(),
  ],
  construct: function(self, options) {

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'generalGroup',
        label: 'General',
        fields: ['title', 'mode']
      },
      {
        name: 'stylingGroup',
        label: 'Styling',
        fields: ['className', 'classNameCustom', 'containerStyles', 'cssHelperClasses']
      }
    ]);

    const superLoad = self.load;
    self.load = (req, widgets, callback) => {

      widgets.forEach((widget) => {
        if (widget.containerStyles) {
          const containerId = self.apos.utils.generateId();
          console.log('Title self.apos.utils.generateId()', self.apos.utils.generateId(), widget.title)
          widget.containerId = containerId;
          widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
        }
        widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
      });

      return superLoad(req, widgets, callback);
    }

    const superOutput = self.output;
    self.output = function(widget, options) {
//      widget.count = self.getCount(widget);

      return superOutput(widget, options);
    };
  }
};
