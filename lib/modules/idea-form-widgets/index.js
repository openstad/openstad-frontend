const rp            = require('request-promise');
const proxy         = require('http-proxy-middleware');
const url           = require('url');
const request       = require('request');
const pick          = require('lodash/pick')
const eventEmitter  = require('../../../events').emitter;

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


module.exports = {
  extend: 'map-widgets',
  label: 'Idea form',
  addFields: [
   {
      name: 'redirect',
      type: 'string',
      label: 'Redirect after submit',
      required: true
  },
  {
     name: 'labelTitle',
     type: 'string',
     label: 'Label for Title',
  },
  {
     name: 'infoTitle',
     type: 'string',
     label: 'Info for Title',
  },

  {
      name: 'requiredTitle',
      type: 'boolean',
      label: 'This field is required',
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
  },
  {
     name: 'labelSummary',
     type: 'string',
     label: 'Label for Summary',
  },
  {
     name: 'infoSummary',
     type: 'string',
     label: 'Info for Summary',
  },
  {
      name: 'typeSummary',
      type: 'select',
      label: 'Field type',
      choices: [
          {
              value: 'text',
              label: "Text bar"
          },
          {
              value: 'textarea',
              label: "Text area"
          },
      ]
  },
  {
      name: 'minSummary',
      type: 'float',
      label: 'Minimum number of characters needed for summary',
  },
  {
      name: 'maxSummary',
      type: 'float',
      label: 'Maximum number of characters needed for summary',
  },
  {
      name: 'requiredSummary',
      type: 'boolean',
      label: 'This field is required',
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
  },
  {
     name: 'labelDescription',
     type: 'string',
     label: 'Label for Description',
  },
  {
     name: 'infoDescription',
     type: 'string',
     label: 'Info for Description',
     textarea: true,
  },
  {
     name: 'editorDescription',
     type: 'boolean',
     label: 'Use text editor',
          choices: [
              {
                  value: true,
                  label: "Display"
              },
              {
                  value: false,
                  label: "Hide"
              },
          ]
  },
  {
      name: 'minDescription',
      type: 'float',
      label: 'Minimum number of characters needed for description',
  },
  {
      name: 'maxDescription',
      type: 'float',
      label: 'Maximum number of characters needed for description',
  },
  {
      name: 'requiredDescription',
      type: 'boolean',
      label: 'This field is required',
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
  },
  {
     name: 'labelImages',
     type: 'string',
     label: 'Label for Images',
  },
  {
     name: 'infoImages',
     type: 'string',
     label: 'Info for Images',
     textarea: true
  },
  {
     name: 'uploadMultiple',
     type: 'boolean',
     label: 'Allow multiple images to be uploaded',
  },
  {
      name: 'requiredImages',
      type: 'boolean',
      label: 'This field is required',
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
  },
  {
     name: 'labelThemes',
     type: 'string',
     label: 'Label for Themes',
  },
  {
     name: 'infoThemes',
     type: 'string',
     label: 'Info for Themes',
     textarea: true

  },
  {
      name: 'requiredThemes',
      type: 'boolean',
      label: 'This field is required',
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
  },
  {
     name: 'labelAreas',
     type: 'string',
     label: 'Label for Areas',
  },
  {
     name: 'infoAreas',
     type: 'string',
     label: 'Info for Areas',
     textarea: true

  },
      {
          name: 'requiredAreas',
          type: 'boolean',
          label: 'This field is required',
          choices: [
              {
                  value: true,
                  label: "Yes"
              },
              {
                  value: false,
                  label: "No"
              },
          ]
      },
  {
     name: 'labelLocation',
     type: 'string',
     label: 'Label for Location',
  },
  {
     name: 'infoLocation',
     type: 'string',
     label: 'Info for Location',
     textarea: true

  },
  {
     name: 'displayLocation',
     type: 'boolean',
     label: 'Display Location',
     choices: [
       {
         value: true,
         label: "Display"
       },
       {
         value: false,
         label: "Hide"
       },
     ]
  },
      {
          name: 'requiredLocation',
          type: 'boolean',
          label: 'This field is required',
          choices: [
              {
                  value: true,
                  label: "Yes"
              },
              {
                  value: false,
                  label: "No"
              },
          ]
      },
  {
      name: 'labelEstimate',
      type: 'string',
      label: 'Label for Estimate costs',
  },
  {
      name: 'infoEstimate',
      type: 'string',
      label: 'Info for Estimate costs',
      textarea: true

  },
  {
      name: 'typeEstimate',
      type: 'select',
      label: 'Field type',
      choices: [
          {
              value: 'text',
              label: "Text bar"
          },
          {
              value: 'textarea',
              label: "Text area"
          },
      ]
  },
  {
      name: 'minEstimate',
      type: 'float',
      label: 'Minimum number of characters needed for estimate',
  },
  {
      name: 'maxEstimate',
      type: 'float',
      label: 'Maximum number of characters needed for estimate',
  },
  {
      name: 'requiredEstimate',
      type: 'boolean',
      label: 'This field is required',
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
  },
  {
      name: 'displayEstimate',
      type: 'boolean',
      label: 'Display Estimate costs',
      choices: [
          {
              value: true,
              label: "Display"
          },
          {
              value: false,
              label: "Hide"
          },
      ]
  },
  {
      name: 'labelRole',
      type: 'string',
      label: 'Label for Role',
  },
  {
      name: 'infoRole',
      type: 'string',
      label: 'Info for Role',
      textarea: true

  },
  {
      name: 'minRole',
      type: 'float',
      label: 'Minimum number of characters needed for role',
  },
  {
      name: 'maxRole',
      type: 'float',
      label: 'Maximum number of characters needed for role',
  },
  {
      name: 'requiredRole',
      type: 'boolean',
      label: 'This field is required',
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
  },
  {
      name: 'typeRole',
      type: 'select',
      label: 'Field type',
      choices: [
          {
              value: 'text',
              label: "Text bar"
          },
          {
              value: 'textarea',
              label: "Text area"
          },
      ]
  },
  {
      name: 'displayRole',
      type: 'boolean',
      label: 'Display Role',
      choices: [
          {
              value: true,
              label: "Display"
          },
          {
              value: false,
              label: "Hide"
          },
      ]
  },
  {
      name: 'labelPhone',
      type: 'string',
      label: 'Label for Phone number',
  },
  {
      name: 'infoPhone',
      type: 'string',
      label: 'Info for Phone number',
      textarea: true

  },
  {
      name: 'minPhone',
      type: 'float',
      label: 'Minimum number of characters needed for phone',
  },
  {
      name: 'maxPhone',
      type: 'float',
      label: 'Maximum number of characters needed for phone',
  },
  {
      name: 'displayPhone',
      type: 'boolean',
      label: 'Display Phone number',
      choices: [
          {
              value: true,
              label: "Display"
          },
          {
              value: false,
              label: "Hide"
          },
      ]
  },
      {
          name: 'requiredPhone',
          type: 'boolean',
          label: 'This field is required',
          choices: [
              {
                  value: true,
                  label: "Yes"
              },
              {
                  value: false,
                  label: "No"
              },
          ]
      },
  {
     name: 'labelAdvice',
     type: 'string',
     label: 'Label for Tip',
  },
  {
     name: 'infoAdvice',
     type: 'string',
     label: 'Info for Tip',
     textarea: true
  },
  {
     name: 'displayAdvice',
     type: 'boolean',
     label: 'Display Tip',
     choices: [
       {
         value: true,
         label: "Display"
       },
       {
         value: false,
         label: "Hide"
       },
     ]
  },
  {
      name: 'minAdvice',
      type: 'float',
      label: 'Minimum number of characters needed for advice',
  },
  {
      name: 'maxAdvice',
      type: 'float',
      label: 'Maximum number of characters needed for advice',
  },
      {
          name: 'requiredAdvice',
          type: 'boolean',
          label: 'This field is required',
          choices: [
              {
                  value: true,
                  label: "Yes"
              },
              {
                  value: false,
                  label: "No"
              },
          ]
      },
  {
     name: 'buttonTextSubmit',
     type: 'string',
     label: 'Text for button to submit',
  },
  {
     name: 'buttonTextSave',
     type: 'string',
     label: 'Text for button to save',
  },

 ],
  construct: function(self, options) {
   options.arrangeFields = (options.arrangeFields || []).concat([
     {
       name: 'general',
       label: 'Algemeen',
       fields: ['redirect']
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
			    const siteConfig = req.data.global.siteConfig;
				widget.siteConfig = {
					ideas: {
						titleMinLength: ( siteConfig && siteConfig.ideas && siteConfig.ideas.titleMinLength ) || 10,
						titleMaxLength: ( siteConfig && siteConfig.ideas && siteConfig.ideas.titleMaxLength ) || 50,
						summaryMinLength: ( siteConfig && siteConfig.ideas && siteConfig.ideas.summaryMinLength ) || 20,
						summaryMaxLength: ( siteConfig && siteConfig.ideas && siteConfig.ideas.summaryMaxLength ) || 140,
						descriptionMinLength: ( siteConfig && siteConfig.ideas && siteConfig.ideas.descriptionMinLength ) || 140,
						descriptionMaxLength: ( siteConfig && siteConfig.ideas && siteConfig.ideas.descriptionMaxLength ) || 5000,
					},
					openstadMap: {
						polygon: ( siteConfig && siteConfig.openstadMap && siteConfig.openstadMap.polygon ) || undefined,
					},
				}

				const markerStyle = siteConfig.openStadMap && siteConfig.openStadMap.markerStyle ? siteConfig.openStadMap.markerStyle : null;

                // Todo: refactor this to get ideaId in a different way

				const idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(req.query.ideaId, 10)) : null;
				const ideas = idea ? [idea] : [];

                widget.mapConfig = self.getMapConfigBuilder(globalData)
                    .setDefaultSettings({
                        mapCenterLat: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[0]) || globalData.mapCenterLat,
                        mapCenterLng: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[1]) || globalData.mapCenterLng,
                        mapZoomLevel: 16,
                        zoomControl: true,
                        disableDefaultUI : true,
                        styles: styles
                    })
                    .setMarkersByIdeas(ideas)
                    .setMarkerStyle(markerStyle)
                    .setEditorMarker()
                    .setEditorMarkerElement('locationField')
                    .setPolygon(req.data.global.mapPolygons || null)
                    .getConfig()
			});

			superLoad(req, widgets, next);
		}


   /**
    * Create route for proxying one image to image server, add api token in header
    */
   self.apos.app.use('/image', proxy({
     target: imageApiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
     }
   }));

   /**
    * Create route for proxying multiples images to image server, add api token in header
    */
   self.apos.app.use('/images', proxy({
     target: imageApiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
     }
   }));

   /**
    * Create route for fetching images by GET from the server
    */
   self.apos.app.use('/fetch-image', (req, res, next) => {
     const imageUrl = req.query.img;
     request.get(imageUrl).pipe(res);
   });

   self.route('post', 'submit', function(req, res) {

     // emit event
     eventEmitter.emit('ideaCrud');

     /**
      * Add CSRF
      */
     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const appUrl = self.apos.settings.getOption(req, 'appUrl');

     const siteId = req.data.global.siteId;
     const postUrl = `${apiUrl}/api/site/${siteId}/idea`;
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
           uri: `${postUrl}/${req.body.ideaId}`,
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
           uri: `${postUrl}/${req.body.ideaId}`,
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
       data.extraData = pick(req.body, 'theme', 'area', 'advice', 'phone', 'estimate', 'role');

       // add the proformatted images
       data.extraData.images = images;

       if (req.data.isAdmin && req.body.modBreak) {
         data.modBreak = req.body.modBreak;
       }

       rp({
           method: req.body.ideaId ? 'PUT' : 'POST',
           uri: req.body.ideaId ? `${postUrl}/${req.body.ideaId}` : postUrl,
           headers: httpHeaders,
           body: data,
           json: true // Automatically parses the JSON string in the response
       })
       .then(function (response) {
    //     console.log('===>>> response', response)
          //parse url to make sure we only redirect to a relative within the site, not external
        /*  let redirectUrl = req.body.redirect || req.header('Referer');
          redirectUrl = url.parse(redirectUrl, true);
          redirectUrl = redirectUrl.path;
          redirectUrl = redirectUrl.replace(':id', response.id);
          redirectUrl = redirectUrl.replace(redirectUrl.protocol, '');
          redirectUrl = redirectUrl.replace(redirectUrl.host, '');
          res.redirect(redirectUrl);
*/

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            id: response.id
          }));
       })
       .catch(function (err) {
         console.log(err.error);
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
     self.pushAsset('script', 'filepond', { when: 'always' });
     self.pushAsset('script', 'map', { when: 'always' });
     self.pushAsset('script', 'editor', { when: 'always' });
     self.pushAsset('script', 'trix', { when: 'always' });
     self.pushAsset('script', 'main', { when: 'always' });
     self.pushAsset('script', 'delete-form', { when: 'always' });
     self.pushAsset('script', 'status-form', { when: 'always' });
   };
  }
};
