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
        let deeplAuthKey = options.deeplKey;
        let supportedLanguages = [];

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
            const cacheKeyForLanguages = 'translationLanguages'

            if (cache.get(cacheKeyForLanguages)) {
                console.log("Received languages from cache");
                supportedLanguages = cache.get(cacheKeyForLanguages);
            }
            else if (deeplAuthKey) {
                try {
                    const translator = new deepl.Translator(deeplAuthKey, translatorConfig);
                    await translator.getTargetLanguages().then(response => {
                        supportedLanguages = response;
                    });
    
                    // convert items to their own language
                    const languageTranslatedCollection = [];
    
                    for (const language of supportedLanguages) {
                        languageTranslatedCollection.push(
                            translator.translateText(
                                language.name,
                                'EN',
                                language.code
                            )
                        );
                    }
    
                    await Promise.all(languageTranslatedCollection).then(languages => {
                        supportedLanguages = languages.map((language, index) => {
                            language['code'] = supportedLanguages[index].code;
                            return language;
                        });
    
                        cache.set(`${cacheKeyForLanguages}`, supportedLanguages, {
                            life: cacheLanguagesLifespan
                        });
                    });
                } catch(error) {
                    supportedLanguages = supportedLanguages.map((language, index) => {
                        language['text'] = supportedLanguages[index].name;
                        return language;
                    })
                    console.error({translationError: error});
                }
            } else {
                console.error({translationError: "Could not fetch languages for the translation widget: Key not set"});
            }

            widgets.forEach((widget) => {
                if (widget.containerStyles) {
                    const containerId = self.apos.utils.generateId();
                    widget.containerId = containerId;
                    widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
                }
                widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
                widget.supportedLanguages = supportedLanguages;
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
