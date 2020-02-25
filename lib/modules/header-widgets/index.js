const styleSchema = require('../../../config/styleSchema.js').default;

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
        /*{
            name: 'introText',
            label: 'Intro text',
            type: 'string',
            widgetType: 'apostrophe-rich-text'
        },*/
        {
            type: 'boolean',
            name: 'showBtnIntro',
            default: true,
            label: 'Show button(s) under intro text',
            choices: [
                {
                    value: true,
                    label: "Yes",
                    showFields: [
                        'btn1Label', 'btn1Url', 'btn2Label', 'btn2Url'
                    ]
                },
                {
                    value: false,
                    label: "No"
                },
            ]
        },
        {
            name: 'btn1Label',
            type: 'string',
            label: 'Left button label',
        },
        {
            name: 'btn1Url',
            type: 'string',
            label: 'Left button URL',
        },
        {
            name: 'btn2Label',
            type: 'string',
            label: 'Right button label',
        },
        {
            name: 'btn2Url',
            type: 'string',
            label: 'Right button URL',
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
                        'btnLabel', 'btnUrl', 'btnIcon', 'targetBlank'
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
        {
            name: 'targetBlank',
            type: 'boolean',
            label: 'Open in new tab',
            def: false
        },
        {
            name: 'hasFixedIdeaCount',
            type: 'boolean',
            label: 'Idea count is fixed',
            def: false,
            choices: [
                {
                    value: true,
                    label: "Yes",
                    showFields: [
                        'fixedIdeaCount'
                    ]
                },
                {
                    value: false,
                    label: "No"
                },
            ]
        },
        {
            name: 'fixedIdeaCount',
            label: 'Fixed idea count (max 3 digits)',
            type: 'string'
        }
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
                
                // Transform the (fixed) idea count to a an array
                if (widget.hasFixedIdeaCount) {
                    widget.ideaCountParts = widget.fixedIdeaCount ? widget.fixedIdeaCount.substring(0, 3).split("") : [];
                } else {
                    widget.ideaCountParts = req.data.ideas ? req.data.ideas.length.toString().split("") : [];
                }
                
                // Prepend the idea count with zeroes to get a length of 3
                // Note: it is possible that we have a length of 4 when there are more than 1000 ideas
                //       the likelihood of this happening is very low, so we can avoid checking that for now.
                while (widget.ideaCountParts.length < 3) {
                    widget.ideaCountParts = [0, ...widget.ideaCountParts];
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
