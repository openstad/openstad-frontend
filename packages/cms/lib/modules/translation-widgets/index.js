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
            const content = req.body.contents;
            const contentString = content.join('');
            const cacheKey = crypto.createHash('sha256').update(contentString).digest('hex');
            
            let result = cache.get(cacheKey);

            if(result) {
                return res.json(result);
            }
            
            console.log({content});

            const translationServiceKey = process.env.TRANSLATION_API_KEY;
            console.log({translationServiceKey});
            const translator = new deepl.Translator(translationServiceKey);
            
            translator.translateText(JSON.stringify(content), req.body.sourceLanguageCode, req.body.targetLanguageCode).then(response => {
                result = response;
                console.log({result});
                return res.json({result});
                // cache.set(cacheKey, JSON.stringify(result), {
                //     life: cacheLifespan
                // })
            }).catch(error => console.log({error}));
        })
    }
};
