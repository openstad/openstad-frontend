const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
    extend:    'apostrophe-widgets',
    label:     'Slider',
    addFields: [
        {
            name:       'items',
            label:      'Items',
            type:       'array',
            titleField: 'title',
            schema:     [
                {
                    type:  'string',
                    name:  'title',
                    label: 'Title'
                },
                {
                    type:     'string',
                    name:     'description',
                    label:    'Description',
                    textarea: true
                },
                {
                    type:  'attachment',
                    name:  'image',
                    label: 'Image'
                }
            ]
        },
        styleSchema.definition('containerStyles', 'Styles for the container')
    ],
    construct: function (self, options) {
        const superLoad = self.load;
        
        self.load = (req, widgets, callback) => {
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
        self.pushAssets     = () => {
            superPushAssets();
            self.pushAsset('stylesheet', 'main', {when: 'always'});
            self.pushAsset('script', 'slider', {when: 'always'});
        };
    }
};
