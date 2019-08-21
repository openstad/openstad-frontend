
module.exports = {
    extend: 'apostrophe-widgets',
    label: 'Page header',
    controls: {
        position: 'bottom-left'
    },
    addFields: [
        {
            name: 'background',
            type: 'attachment',
            label: 'Image',
            required: true,
            trash: true,
            svgImages: true
        },
        {
            name: 'title',
            type: 'string',
            label: 'Titel',
        },
        {
            name: 'subtitle',
            type: 'string',
            label: 'Subtitle',
        },
        {
            name: 'introText',
            type: 'string',
            label: 'Intro text',
        },
        {
            type: 'boolean',
            name: 'showBtn',
            default: true,
            label: 'Show button in right column',
            choices: [
                {
                    value: true,
                    label: "Yes",
                    showFields: [
                        'btnLabel', 'btnUrl', 'btnIcon'
                    ]
                },
                {
                    value: false,
                    label: "No"
                },
            ]
        },
        {
            name: 'btnLabel',
            type: 'string',
            label: 'Button label',
        },
        {
            name: 'btnUrl',
            type: 'string',
            label: 'Button URL',
        },
        {
            name: 'btnIcon',
            type: 'attachment',
            label: 'Image',
            required: true,
            trash: true,
            svgImages: true
        },
    ],

    construct: function(self, options) {
        const superLoad = self.load;
        self.load = function (req, widgets, callback) {
            widgets.forEach((widget) => {
                if (widget.imageStyles) {
                    const imageId = styleSchema.generateId();
                    widget.imageId = imageId;
                    widget.formattedImageStyles = styleSchema.format(imageId, widget.imageStyles);
                }
            });
            return superLoad(req, widgets, callback);
        };

        var superPushAssets = self.pushAssets;
        self.pushAssets = function() {
            superPushAssets();
            self.pushAsset('stylesheet', 'main', { when: 'always' });
        };
    }
};