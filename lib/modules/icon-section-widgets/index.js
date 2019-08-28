const styleSchema = require('../../../config/styleSchema.js').default;

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
                {
                    name:       'description',
                    type:       'string',
                    label: 'Beschrijving'
                },
                
                {
                    name:      'image',
                    type:      'attachment',
                    label:     'Image',
                    svgImages: true,
                    trash:     true
                },
                {
                    name:  'linkUrl',
                    type:  'text',
                    label: 'Link URL',
                    type:  'string',
                },
                {
                    name:  'linkTitle',
                    type:  'text',
                    label: 'Link title',
                    type:  'string',
                },
            ]
        },
        {
            name:  'imageHeight',
            type:  'string',
            label: 'Image Height',
        },
        styleSchema.definition('containerStyles', 'Styles for the container')
    ],
    construct: function (self, options) {
        const superLoad = self.load;
        self.load       = (req, widgets, callback) => {
            widgets.forEach((widget) => {
                if (widget.containerStyles) {
                    const containerId               = styleSchema.generateId();
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
