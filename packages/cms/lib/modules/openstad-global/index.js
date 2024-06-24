/**
 * Customizing Apostrophe Global settings
 *
 * Be aware that apostropheCMS puts all global settings in the HTML source so global fields are not suited for sensitive settings
 */
const auth              = require('basic-auth');
const compare           = require('tsscmp');
const fs     = require('fs');
const fields            = require('./lib/fields');
const arrangeFields     = require('./lib/arrangeFields');

const deepl = require('deepl-node');
const cache = require('../../../services/cache').cache;
const cacheLanguagesLifespan = (24 * 60 * 60) * 7;   // set lifespan of language cache to a week;
const translatorConfig = { maxRetries: 5, minTimeout: 10000 };

function unauthorized(req, res) {
    var challengeString = 'Basic realm=Openstad';
    res.set('WWW-Authenticate', challengeString);
    return res.status(401).send('Authentication required.');
}

async function getSupportedLanguages(deeplAuthKey) {
  let supportedLanguages = [];
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
  return supportedLanguages;
}

module.exports = {
  improve: 'apostrophe-global',
  addFields: fields,
  afterConstruct: function(self) {
    
    self.expressMiddleware.push(self.overrideGlobalDataWithSiteConfig);
  },
  construct: function (self, options) {
    require('./lib/api')(self, options);
    
    self.on('apostrophe:modulesReady', 'setSyncFields');
    self.on('apostrophe-docs:beforeSave', 'formatGlobalFields');
    self.on('apostrophe-docs:afterSave', 'syncApi');
    self.on('apostrophe-docs:afterSave', 'clearCache');


    var superPushAssets = self.pushAssets;
    self.pushAssets = function () {
        superPushAssets();
        self.pushAsset('script', 'always', { when: 'always' });
    };

    options.arrangeFields = arrangeFields.concat(options.arrangeFields || []);

    self.apos.app.use(async (req, res, next) => {
      let deeplAuthKey = options.deeplKey;
      req.data.global = req.data.global ? req.data.global : {};
      req.data.global.languages = await getSupportedLanguages(deeplAuthKey);
      return next();
    });

    self.apos.app.use((req, res, next) => {
      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
      // load env sheets that have been set for complete Environment, not just one site specific
      if (process.env.STYLESHEETS) {
        const sheets = process.env.STYLESHEETS.split(',');
        req.data.envStyleSheets = sheets;
      }

      // for legacy purposes, remove to better solutions at some point
      // Amsterdam
      if (!req.data.global.siteLogo && process.env.LOGO_AMSTERDAM && process.env.LOGO_AMSTERDAM === 'yes') {
        //make sure we
        req.data.global.siteLogo = 'amsterdam';
      }



      // WARNING!!!! ApostrhopeCMS exposes global values in HTML often, so DONT add senstive info in global
      req.data.global.siteConfig = {
        ideas: siteConfig.ideas,
        articles: siteConfig.articles,
        polls: siteConfig.polls,
        votes: siteConfig.votes,
        area: siteConfig.area,
        arguments:siteConfig.arguments,
        openstadMap:siteConfig.openstadMap,
        users: {
          allowUseOfNicknames: siteConfig.users && siteConfig.users.allowUseOfNicknames ? siteConfig.users.allowUseOfNicknames : false
        }
      };

      req.data.originalUrl = req.originalUrl;

      // use defaults from env vars
      let cmsDefaults = process.env.CMS_DEFAULTS;
      try {
        if (typeof cmsDefaults == 'string') cmsDefaults = JSON.parse(cmsDefaults);
      } catch(err) {
      }
      req.data.global.cmsDefaults = cmsDefaults
      if (typeof req.data.global.analyticsType === 'undefined' || req.data.global.analyticsType === '' ) {
        req.data.global.analyticsType = ( cmsDefaults && cmsDefaults.analyticsType ) || 'none';
      }
      if (req.data.global.analyticsType === 'serverdefault' ) {
        req.data.global.analyticsType = ( cmsDefaults && cmsDefaults.analyticsType ) || 'none';
        req.data.global.analyticsCodeBlock = cmsDefaults && cmsDefaults.analyticsCodeBlock;
        req.data.global.analyticsIdentifier = cmsDefaults && cmsDefaults.analyticsIdentifier;
      }

      // backwards compatibility for analytics
      // TODO: is there a way to use the value of an old field as default for a new field?
      if (typeof req.data.global.analyticsType == 'undefined' || ( req.data.global.analyticsType == 'google-analytics-old-style' && req.data.global.analyticsIdentifier == '' && req.data.global.analytics ) ) {
        req.data.global.analyticsType = 'google-analytics-old-style';
        req.data.global.analyticsIdentifier = req.data.global.analytics;
      }

      // get the identifier for making sure that the custom js/css files we load in also bust the cache
      req.data.assetsGeneration = fs.existsSync('data/generation') ? fs.readFileSync('data/generation').toString().trim() : Math.random().toString(36).slice(-5);
      //add query tot data object, so it can be used in templates
      req.data.query = req.query;

      next();
    });
  }
};
