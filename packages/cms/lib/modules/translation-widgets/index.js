const styleSchema = require('../../../config/styleSchema.js').default;
const deepl = require('deepl-node');
const cache = require('../../../services/cache').cache;
const cacheLanguagesLifespan = (24 * 60 * 60) * 7;   // set lifespan of language cache to a week;
const translatorConfig = { maxRetries: 5, minTimeout: 10000 };

module.exports = {
    extend: 'openstad-widgets',
    label: 'Translate',
    addFields: [
        styleSchema.definition('containerStyles', 'Styles for the container'),
        styleSchema.getHelperClassesField(),
    ],
    playerData: [],
    construct: function (self, options) {
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
        self.load = async (req, widgets, callback) => {
            widgets.forEach((widget) => {
                if (widget.containerStyles) {
                    const containerId = self.apos.utils.generateId();
                    widget.containerId = containerId;
                    widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
                }
                widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
                widget.supportedLanguages = req.data.global.languages;
            });

            return superLoad(req, widgets, callback);
        }

        const superOutput = self.output;
        self.output = function (widget, options) {
            return superOutput(widget, options);
        };

        var superPushAssets = self.pushAssets;
        self.pushAssets = function () {
            superPushAssets();
            self.pushAsset('stylesheet', 'main', { when: 'always' });
            self.pushAsset('script', 'always', { when: 'always' });
        };

        self.route('post', 'submit', function (req, res) {
            const translate = options.apos.global.translate;
            translate(req, res);
        });
    }
};
