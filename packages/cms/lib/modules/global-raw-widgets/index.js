const styleSchema = require('../../../config/styleSchema.js').default;

const fields = [
    {
        name: 'rawKey',
        type: 'string',
        label: 'Fill in key for your defined template in global',
    },
    styleSchema.definition('containerStyles', 'Styles for the container'),
]

module.exports = {
    extend: 'openstad-widgets',
    label: 'Global raw widget',
    addFields: fields,
    construct: function (self, options) {
        let classIdeaId;
        const resourceType = 'idea';

        const superLoad = self.load;
        self.load = function (req, widgets, next) {
            const rawTemplates = req.data.global && req.data.global.rawTemplates ? req.data.global.rawTemplates : [];

            widgets.forEach((widget) => {
                // render string with variables. Add active recource
                if (widget.containerStyles) {
                    const containerId = widget._id;
                    widget.containerId = containerId;
                    widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
                }

                // Add function for rendering raw string with nunjucks templating engine
                // Yes this ia a powerful but dangerous plugin :), admin only
                widget.renderString = (data) => {
                    const templateObj = rawTemplates.find(tpl => tpl.key === widget.rawKey);

                    try {
                        return self.apos.templates.renderStringForModule(req, templateObj && templateObj.template ? templateObj.template : '', data, self);
                    } catch (e) {
                        return 'Error....'
                    }
                }
            });

            return superLoad(req, widgets, next);
        }

    }
};
