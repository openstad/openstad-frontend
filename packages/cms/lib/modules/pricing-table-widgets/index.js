/**
 * A section with static content allowing for a column view with icon and
 * Technically can also be made with dynamic sections and content, but often used so it's own widget
 */
const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
    extend:    'openstad-widgets',
    label:     'Pricing table',
    adminOnly: true,
    addFields: [
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
                    name:  'price',
                    type:  'text',
                    label: 'Price',
                    type:  'string',
                },
                {
                    name:  'pricePer',
                    type:  'text',
                    label: 'Price per',
                    type:  'string',
                },
                {
                    name:  'title',
                    type:  'text',
                    label: 'Titel',
                    type:  'string',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'text',
                    type: 'string',
                    textarea: true
                },
                {
                    name: 'features',
                    type: 'array',
                    titleField: 'description',
                    schema: [
                        {
                          name: 'description',
                          type: 'text',
                          label: 'Description',
                          type: 'string',
                        },
                    ]
                },
                {
                  name: 'ctaButtonUrl',
                  type: 'text',
                  label: 'Cta Button Url',
                  type: 'string',
                },
                {
                  name: 'ctaButtonText',
                  type: 'text',
                  label: 'Cta Button Text',
                  type: 'string',
                },

            ]
        },


      styleSchema.definition('containerStyles', 'Styles for the container')
    ],
  construct: function (self, options) {
        const superLoad = self.load;
        self.load       = (req, widgets, callback) => {
            widgets.forEach((widget) => {
                if (widget.containerStyles) {
                    const containerId               = widget._id;
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
