const styleSchema = require('../../../config/styleSchema.js').default;
const crypto = require('crypto');
const deepl = require('deepl-node');
const { response } = require('express');
const cache = require('../../../services/cache').cache;
const cacheLifespan = 8 * 60 * 60;   // set lifespan of 8 hours;
const cacheLanguagesLifespan = 60 * 60 * 60;   // set lifespan of language cache to a high value;

module.exports = {
    extend: 'openstad-widgets',
    label: 'Translate',
    addFields: [
        {
            name: 'deeplKey',
            type: 'string',
            label: 'Deepl api key',
        },
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

            if (deeplAuthKey) {
                const cacheKeyForLanguages = 'translationLanguages'
                if (cache.get(cacheKeyForLanguages)) {
                    console.log("Received languages from cache");
                    supportedLanguages = cache.get(cacheKeyForLanguages);
                }
                else {
                    const translator = new deepl.Translator(deeplAuthKey);
                    await translator.getTargetLanguages().then(response => {
                        supportedLanguages = response
                        cache.set(`${cacheKeyForLanguages}`, response, {
                            life: cacheLifespan
                        })
                    })
                }
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
            let content = req.body.contents;
            let referer = req.headers.referer;
            const destinationLanguage = req.body.targetLanguageCode;
            const cacheKey = crypto.createHash('sha256').update(`${destinationLanguage}${referer}`).digest('hex');

            let result = cache.get(cacheKey);

            if (result) {
                console.log("Receiving translations from cache");
                return res.json(result);
            }

            if (deeplAuthKey) {
                const translator = new deepl.Translator(deeplAuthKey);
                translator.translateText(
                    content,
                    req.body.sourceLanguageCode,
                    req.body.targetLanguageCode,
                )
                    .then(response => {
                        cache.set(`${cacheKey}`, response, {
                            life: cacheLifespan
                        })
                        return res.json(response);
                    })
                    .catch(error => console.log({ error }));
            } else {
                res.status(400).send('No valid key provided')
            }

        })
    }
};
