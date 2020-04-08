const rp            = require('request-promise');
const proxy         = require('http-proxy-middleware');
const url           = require('url');
const request       = require('request');
const pick          = require('lodash/pick')
const eventEmitter  = require('../../../events').emitter;
const resourcesSchema = require('../../../config/resources.js').schemaFormat;
const getResourceInfo = require('../../../config/resources.js').get;

const imageApiUrl   = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_ACCESS_TOKEN;


const toSqlDatetime = (inputDate) => {
    const date = new Date()
    const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    return dateWithOffest
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
}

const fields = require('./lib/fields.js');

module.exports = {
  extend: 'map-widgets',
  label: 'Resource form',
  addFields: fields,
  construct: function(self, options) {
   options.arrangeFields = (options.arrangeFields || []).concat([
     {
       name: 'resource',
       label: 'resource ',
       type: 'select',
       choices: resourcesSchema
     },
     {
       name: 'general',
       label: 'Algemeen',
       fields: ['resource', 'redirect', 'formType', 'dynamicFormSections']
     },
     {
       name: 'title',
       label: 'Title',
       fields: ['labelTitle', 'infoTitle', 'requiredTitle', 'minTitle', 'maxTitle']
     },
     {
       name: 'summary',
       label: 'Summary',
       fields: ['labelSummary', 'infoSummary', 'requiredSummary', 'typeSummary', 'minSummary', 'maxSummary']
     },
     {
       name: 'description',
       label: 'Description',
       fields: ['labelDescription', 'infoDescription', 'editorDescription', 'requiredDescription', 'minDescription', 'maxDescription']
     },
     {
       name: 'images',
       label: 'Images Upload',
       fields: ['labelImages', 'infoImages', 'uploadMultiple', 'requiredImages']
     },
     {
       name: 'themes',
       label: 'Themes',
       fields: ['labelThemes', 'infoThemes', 'requiredThemes']
     },
     {
       name: 'areas',
       label: 'Areas',
       fields: ['labelAreas', 'infoAreas', 'requiredAreas']
     },
     {
       name: 'location',
       label: 'Location',
       fields: ['labelLocation', 'infoLocation', 'displayLocation', 'requiredLocation']
     },
     {
         name: 'Estimate',
         label: 'Estimate costs',
         fields: ['labelEstimate', 'infoEstimate', 'displayEstimate', 'requiredEstimate', 'typeEstimate', 'minEstimate', 'maxEstimate']
     },
     {
         name: 'Role',
         label: 'Role',
         fields: ['labelRole', 'infoRole', 'displayRole', 'requiredRole', 'typeRole', 'minRole', 'maxRole']
     },
     {
         name: 'Phone',
         label: 'Phone number',
         fields: ['labelPhone', 'infoPhone', 'displayPhone', 'requiredPhone', 'minPhone', 'maxPhone']
     },
     {
       name: 'advice',
       label: 'Tip',
       fields: ['labelAdvice', 'infoAdvice', 'displayAdvice', 'requiredAdvice', 'minAdvice', 'maxAdvice']
     },
     {
       name: 'submitting',
       label: 'Submitting',
       fields: ['buttonTextSubmit', 'buttonTextSave']
     },
   ]);

    /** add config **/
    const superLoad = self.load;

    self.load = function(req, widgets, next) {
        const styles = self.apos.settings.getOption(req, 'openStadMap').defaults.styles;
        const globalData = req.data.global;

	      widgets.forEach((widget) => {
            const resourceType = widget.resource;
            const resourceInfo = getResourceInfo(resourceType).configKey;
            const resourceConfigKey = resourceInfo ? resourceInfo.configKey : false;
            const resourceConfig = req.data.global.siteConfig && req.data.global.siteConfig[resourceConfigKey] ? req.data.global.siteConfig[resourceConfigKey] : {};

	          const siteConfig = req.data.global.siteConfig;

            widget.resourceConfig = {
              titleMinLength: ( resourceConfig.titleMinLength ) || 10,
              titleMaxLength: ( resourceConfig.titleMaxLength ) || 50,
              summaryMinLength: ( resourceConfig.summaryMinLength ) || 20,
              summaryMaxLength: ( resourceConfig.summaryMaxLength ) || 140,
              descriptionMinLength: ( resourceConfig.descriptionMinLength ) || 140,
              descriptionMaxLength: ( resourceConfig.descriptionMaxLength ) || 5000,
            }

    				widget.siteConfig = {
    					openstadMap: {
    						polygon: ( siteConfig && siteConfig.openstadMap && siteConfig.openstadMap.polygon ) || undefined,
    					},
    				}

    				const markerStyle = siteConfig.openStadMap && siteConfig.openStadMap.markerStyle ? siteConfig.openStadMap.markerStyle : null;

            // Todo: refactor this to get resourceId in a different way
    				const activeResource = req.data.activeResource;
    				const resources = activeResource ? [activeResource] : [];

            widget.mapConfig = self.getMapConfigBuilder(globalData)
                .setDefaultSettings({
                    mapCenterLat: (activeResource && activeResource.location && activeResource.location.coordinates && activeResource.location.coordinates[0]) || globalData.mapCenterLat,
                    mapCenterLng: (activeResource && activeResource.location && activeResource.location.coordinates && activeResource.location.coordinates[1]) || globalData.mapCenterLng,
                    mapZoomLevel: 16,
                    zoomControl: true,
                    disableDefaultUI : true,
                    styles: styles
                })
                .setMarkersByIdeas(resources)
                .setMarkerStyle(markerStyle)
                .setEditorMarker()
                .setEditorMarkerElement('locationField')
                .setPolygon(req.data.global.mapPolygons || null)
                .getConfig()
  		});

			superLoad(req, widgets, next);
		}

   self.route('post', 'submit', function(req, res) {

     // emit event
     eventEmitter.emit('resourceCrud');

     /**
      * Add
      */
     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const appUrl = self.apos.settings.getOption(req, 'appUrl');

     const siteId = req.data.global.siteId;
     const postUrl = `${apiUrl}/api/site/${siteId}/${req.body.resourceType}`;
     const httpHeaders = {
         'Accept': 'application/json',
         "X-Authorization" : `Bearer ${req.session.jwt}`,
     };

     let redirect = req.body.redirect || req.header('Referer');

     if (req.body.action && (req.body.action === 'UPDATE_STATUS' || req.body.action === 'MODBREAK') ) {
       const data = {};

       if (req.body.status) {
         data.status = req.body.status;
       }

       if (req.body.modBreak) {
         var datetime = new Date();

         data.modBreak = req.body.modBreak;
         data.modBreakUserId = req.data.openstadUser.id;
         data.modBreakDate = req.body.modBreakDate ? req.body.modBreakDate : toSqlDatetime();
       }

       rp({
           method: 'PUT',
           uri: `${postUrl}/${req.body.resourceId}`,
           headers: httpHeaders,
           body: data,
           json: true // Automatically parses the JSON string in the response
       })
       .then(function (response) {
          //req.flash('success', { msg: 'Status aangepast!'});
          res.setHeader('Content-Type', 'application/json');

          res.end(JSON.stringify({
            id: response.id
          }));
          //res.redirect(req.header('Referer') || '/');
       })
       .catch(function (err) {
         res.status(500).json(JSON.stringify(err));

        //req.flash('error', { msg: 'Status niet aangepast!'});
         //return res.redirect(req.header('Referer') || '/');
       });



     } else if (req.body.action && req.body.action === 'DELETE') {
       rp({
           method: 'DELETE',
           uri: `${postUrl}/${req.body.resourceId}`,
           headers: httpHeaders,
           json: true // Automatically parses the JSON string in the response
       })
       .then(function (response) {
        //  req.flash('success', { msg: 'Verwijderd!'});
        //  res.redirect('/');
          res.setHeader('Content-Type', 'application/json');

          res.end(JSON.stringify({
            id: response.id
          }));
       })
       .catch(function (err) {
        // req.flash('error', { msg: 'Er ging iets mis met verwijderen'});
        // return res.redirect(req.header('Referer')  || appUrl);
        res.status(500).json(JSON.stringify(err));

       });
     } else {
       // when only one image filepondjs sadly just returns object, not array with one file,
       // to make it consistent we turn it into an array
       req.body.image = req.body.image && typeof req.body.image === 'string' ? [req.body.image] : req.body.image;

       // format images
       const images = req.body.image ? req.body.image.map(function(image) {
         image = JSON.parse(image);
         return image ? image.url : '';
       }) : [];

       const data = {
         title: req.body.title,
         description: req.body.description,
         summary: req.body.summary ? req.body.summary.replace(/(\r\n|\n|\r)/gm, "") : '',
         location: req.body.location,
       };

       // get the extra data from the body if set, with pick
       // @todo move to global / api setting.
       data.extraData = pick(req.body, 'theme', 'area', 'advice', 'phone', 'estimate', 'role', 'isOrganiserQuestion', 'isOrganiserName', 'isOrganiserWebsite', 'helpNeededQuestion', 'helpNeededDescription', 'helpNeededApply' , 'isOrganiserPhone', 'isOrganiserEmail');

       // add the proformatted images
       data.extraData.images = images;

       if (req.data.isAdmin && req.body.modBreak) {
         data.modBreak = req.body.modBreak;
       }

       // only allow updating budget if isAdmin, bit double since also done in the API
       if (req.data.isAdmin) {
           data.budget = req.body.budget;
       }

       rp({
           method: req.body.resourceId ? 'PUT' : 'POST',
           uri: req.body.resourceId ? `${postUrl}/${req.body.resourceId}` : postUrl,
           headers: httpHeaders,
           body: data,
           json: true // Automatically parses the JSON string in the response
       })
       .then(function (response) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            id: response.id
          }));
       })
       .catch(function (err) {
         res.setHeader('Content-Type', 'application/json');
         res.status(500).end(JSON.stringify({
           msg: err.error[0]
         }));
        // res.redirect(req.header('Referer')  || appUrl);
       });
     }
    // Access req.body here
    // Send back an AJAX response with `res.send()` as you normally do with Express
  });

  const superPushAssets = self.pushAssets;
   self.pushAssets = function () {
     superPushAssets();
     self.pushAsset('stylesheet', 'filepond', { when: 'always' });
     self.pushAsset('stylesheet', 'trix', { when: 'always' });
     self.pushAsset('stylesheet', 'form', { when: 'always' });
     self.pushAsset('stylesheet', 'main', { when: 'always' });
     self.pushAsset('script', 'map', { when: 'always' });
     self.pushAsset('script', 'editor', { when: 'always' });


     self.pushAsset('script', 'main', { when: 'always' });
     self.pushAsset('script', 'delete-form', { when: 'always' });
     self.pushAsset('script', 'status-form', { when: 'always' });

     //because of size load in directly in template for now, in future we might consider loading them in user script
     //and load the user script also when users log in via openstad.
     //self.pushAsset('script', 'filepond', { when: 'always' });
     // self.pushAsset('script', 'trix', { when: 'always' });
   };
  }
};
