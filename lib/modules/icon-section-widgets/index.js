const styleSchema = require('../../../config/styleSchema.js').default;
const textFieldType = process.env.USE_RICH_TEXT_FIELDS === 'yes' ? 'singleton' : 'text';
const widgetType = textFieldType === 'singleton' ? 'apostrophe-rich-text' : null;

if (textFieldType === 'text') {
  var descriptionBlock = {
    name: 'description',
    label: 'Description',
    type: textFieldType,
    type: 'string',
  };
} else {
  var descriptionBlock = {
    name: 'description',
    label: 'Description',
    type: textFieldType,
    widgetType: widgetType
  };
}

module.exports = {
    extend:    'apostrophe-widgets',
    label:     'Icon section',
    addFields: [
        {
            name:     'title',
            type:     'string',
            label:    'Title',
            required: true
        },
        {
            name:     'containerId',
            type:     'string',
            label:    'HTML Container id (must be unique on the page for css)',
        },
        {
            type:    'boolean',
            name:    'sectionOpen',
            default: true,
            label:   'Section open by default?',
            choices: [
                {
                    value: true,
                    label: "Open"
                },
                {
                    value: false,
                    label: "closed"
                },
            ]
        },
        {
            name: 'typeArrow',
            label: 'Toggle arrow color',
            type: 'select',
            required: true,
            choices: [
                {
                    label: 'White',
                    value: 'arrow_down_white'
                },
                {
                    label: 'Black',
                    value: 'arrow_down_black'
                }
            ]
        },
        {
            name:       'steps',
            type:       'array',
            titleField: 'title',
            schema:     [
                {
                    name:  'title',
                    type:  'text',
                    label: 'Titel',
                    type:  'string',
                },
                descriptionBlock,
                {
                  name: 'image',
                  type: 'attachment',
                  label: 'Image',
                  svgImages: true,
                  trash: true
                },
                {
                  name: 'linkUrl',
                  type: 'text',
                  label: 'Link URL',
                  type: 'string',
                },
                {
                  name: 'linkTitle',
                  type: 'text',
                  label: 'Link title',
                  type: 'string',
                },
            ]
        },
        {
          name: 'imageHeight',
          type: 'string',
          label: 'Image Height',
        },
      styleSchema.definition('containerStyles', 'Styles for the container')
    ],
  construct: function (self, options) {
        const superLoad = self.load;
        self.load       = (req, widgets, callback) => {
            widgets.forEach((widget) => {
                if (widget.containerStyles) {
                    const containerId               = widget.containerId ? widget.containerId : styleSchema.generateId();
                    widget.containerId              = containerId;
                    widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
                }
            });

            return superLoad(req, widgets, callback);
        }

        var superPushAssets = self.pushAssets;
        self.pushAssets     = function () {
            superPushAssets();
            self.pushAsset('stylesheet', 'main', {when: 'always'});
        };
    }
};
