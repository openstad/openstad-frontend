const polygons = require('../../../../config/map').default.polygons;
var _ = require('lodash');
const eventEmitter = require('../../../../events').emitter;

const crypto = require('crypto');
const deepl = require('deepl-node');
const cache = require('../../../../services/cache').cache;

const cacheLifespan = 8 * 60 * 60;   // set lifespan of 8 hours;
const translatorConfig = { maxRetries: 5, minTimeout: 10000 };


module.exports = (self, options) => {

  self.translate = async (req, res) => {
    const deeplAuthKey = options.deeplKey;
    const content = req.body.contents;
    const origin = req.body.origin;
    const sourceLanguageCode = req.body.sourceLanguageCode;
    const destinationLanguage = req.body.targetLanguageCode;

    const cacheKey = crypto.createHash('sha256').update(`${destinationLanguage}${origin}${JSON.stringify(content)}`).digest('hex');

    if (!origin) {
      return res.status(400).json({ error: 'Could not determine the page to translate' });
    }

    const collection = self.apos.db.collection("deepl-translations");
    const result = await collection.findOne({_id: cacheKey});
    if (result) {
      console.log(`Receiving translations from cache for site ${origin}`);
      return res.json(result.translations);
    }

    // content should always be a collection of dutch terms, translations to other languages are translated from dutch to (for example) english
    if (destinationLanguage === 'nl') {
      console.log(`Target language is dutch, not translating and responding with the dutch sentences received for site ${origin}`);
      return res.json(content);
    }


    if (deeplAuthKey) {
      let translator = null;

      try {
        translator = new deepl.Translator(deeplAuthKey, translatorConfig);
      } catch (error) {
        console.log({ error });
        return res.status(500).json({ error: 'Could not translate the page at this time' });
      }

      const characterCount = content.map(word => word.length).reduce((total, a) => total + a, 0);

      if (translator) {
        console.log(`No existing translations found, fetching translations from deepl for site: ${origin} with karaktersize of ${characterCount} and destination language ${destinationLanguage}`)

        translator.translateText(
          content,
          sourceLanguageCode,
          destinationLanguage,
        ).then(response => {
          collection.findOneAndUpdate(
            {"_id": cacheKey},
            { $set: { "translations": response}},
            {upsert:true}
          );
          return res.json(response);
        })
          .catch(error => {
            console.error({ error });
            return res.status(500).json({ error: 'Error while translating the page' });
          });
      }
    } else {
      return res.status(400).json({ error: 'No valid key provided' });
    }
  }

  self.apos.app.post('/modules/openstad-global/translate', function (req, res) {
    self.translate(req, res);
  });

  self.setSyncFields = () => {
    self.apiSyncFields = self.apos.openstadApi.getApiSyncFields(options.addFields);
  };

  // Overriding requirePieceEditorView to sync global field values with api.
  self.requirePieceEditorView = function (req, res, next) {
    const id = self.apos.launder.id(req.body._id);

    if (!self.apos.permissions.can(req, 'edit-' + self.name)) {
      return self.apiResponse(res, 'forbidden');
    }

    return self.findForEditing(req, { _id: id })
      .toObject(function (err, _piece) {
        if (err) {
          return self.apiResponse(res, err);
        }
        if (!_piece) {
          return self.apiResponse(res, 'notfound');
        }

        // Todo: deserialize formatting fields to get values from the api?

        req.piece = self.apos.openstadApi.syncApiFields(_piece, self.apiSyncFields, req.data.global.siteConfig, req.data.global.workflowLocale);

        return next();
      });
  };


  self.formatGlobalFields = (req, doc, options) => {
    //    console.log('req', req)
    // for some reason apos calls this with empty req object on start, this will cause formatting issues so skip in that case
    if (!req.headers) {
      return;
    }

    self.schema.forEach((field, i) => {
      if (field.formatField) {
        //doc is the doc for saving in mongodb, in this case it's the global values
        doc[field.name] = field.formatField(field, self.apos, doc, req);
      }

    });
  };

  self.syncApi = async (req, doc, options) => {
    // Avoid syncing api when it's a default-draft save from workflow
    if (doc.type !== 'apostrophe-global' || (doc.workflowLocale && doc.workflowLocale === 'default-draft')) {
      return;
    }

    if (req.data.global) {
      try {
        await self.apos.openstadApi.updateSiteConfig(req, req.data.global.siteConfig, doc, self.apiSyncFields);
      } catch (err) {
        console.error(err);
      }
    }
  };

  self.clearCache = (req, doc, options) => {
    eventEmitter.emit('clearCache');
  }

  self.overrideGlobalDataWithSiteConfig = (req, res, next) => {
    const siteConfig = self.apos.settings.getOption(req, 'siteConfig');

    // Take default site ID, possible to overwritten
    if (!req.data.global.siteId) {
      req.data.global.siteId = siteConfig.id;
    }

    // empty
    //  req.data.global.siteTitle = '';

    req.data.global.siteConfigTitle = siteConfig.title;

    //  req.data.global.siteConfig = siteConfig;
    req.data.originalUrl = req.originalUrl;

    //add query tot data object, so it can be used
    req.data.query = req.query;

    //
    if (siteConfig && siteConfig.area && siteConfig.area.polygon) {
      req.data.global.mapPolygons = siteConfig && siteConfig.area && siteConfig.area.polygon || '';
    }

    // Todo: remove this fallback when every site use the areaId from the api.
    // This is the fallback for old sites, polygons were hardcoded in the site
    if (req.data.global.mapPolygons === '' && req.data.global.mapPolygonsKey) {
      req.data.global.mapPolygons = polygons[req.data.global.mapPolygonsKey];
    }

    next();
  };

  self.loadPolygonsFromApi = async function (addPolygonData) {
    try {
      const areas = await self.apos.openstadApi.getAllPolygons();

      if (areas) {
        return [{ label: 'Geen', value: '' }].concat(areas.map((area) => {

          const data = {
            label: area.name,
            value: area.id
          }

          if (addPolygonData) {
            data.polygon = area.polygon;
          }

          return data;
        }))
      }
      throw new Error('No polygons found');
    } catch (error) {
      // @todo: proper error handling
      return [];
    }
  };
};
