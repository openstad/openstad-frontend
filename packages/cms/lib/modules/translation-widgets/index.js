const styleSchema = require('../../../config/styleSchema.js').default;
const crypto = require('crypto');
const deepl = require('deepl-node');
const { chunk, result } = require('lodash');
const translationServiceKey = process.env.TRANSLATION_API_KEY;
const translator = new deepl.Translator(translationServiceKey);
const cache = require('../../../services/cache').cache;
const cacheLifespan  = 8*60*60;   // set lifespan of 8 hours;
const _ = require('lodash')

module.exports = {
    extend: 'openstad-widgets',
    label: 'Translate',
    addFields: [
        {
            name: 'translate',
            type: 'string',
            label: 'Translate ',
        },
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
            //      widget.count = self.getCount(widget);

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
                console.info("Returning translations from cache");
                return res.json(result);
            }


            // There seems to be a bug, when you send a sentence like ", or blablabla" that the translateText function splits on this text, causing an error when running JSON.parse on the translated result, hacky fix
            const stringifiedContent =  JSON.stringify(content.map(element =>{return element.replace(",", "<k0mma>")}));
        
            translator.translateText(
                stringifiedContent,
                req.body.sourceLanguageCode,
                req.body.targetLanguageCode,
            )
            .then(response => {
                cache.set(`${destinationLanguage}${cacheKey}`, response.text, {
                    life: cacheLifespan
                })
                return res.json(response.text);
            })
            .catch(error => console.log({error}));
        })
    }
};
