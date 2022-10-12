const styleSchema = require('../../../config/styleSchema.js').default;
const crypto = require('crypto');
const deepl = require('deepl-node');
const cache = require('../../../services/cache').cache;
const cacheLifespan  = 8*60*60;   // set lifespan of 8 hours;

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
        self.load = (req, widgets, callback) => {

            widgets.forEach((widget) => {
                if (widget.containerStyles) {
                    const containerId = self.apos.utils.generateId();
                    widget.containerId = containerId;
                    widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
                }
                widget.cssHelperClassesString = widget.cssHelperClasses ? widget.cssHelperClasses.join(' ') : '';
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
            self.pushAsset('script', 'always', { when: 'always' });
        };

        self.route('post', 'submit', function(req, res) {
            let content = req.body.contents;
            let referer = req.headers.referer;
            const destinationLanguage = req.body.targetLanguageCode;
            const cacheKey = crypto.createHash('sha256').update(`${destinationLanguage}${referer}`).digest('hex');
            
            let result = cache.get(cacheKey);

            if(result) {
                console.log("Receiving translations from cache");
                return res.json(result);
            }

            // frontend/packages/cms/lib/modules/openstad-custom-pages/index.js added a property to the prototype. This breaks the array overload of the translate function
            delete Array.prototype.insert;

            if(deeplAuthKey) {
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
                .catch(error => console.log({error}));
            } else {
                res.status(400).send('No valid key provided')
            }
            
        })
    }
};
