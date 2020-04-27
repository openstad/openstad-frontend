/*
  CURRENTLY IN TRANSITION.
  SOME ASSETS FILES ARE IN THE IDEA overview
  MAIN ISSUE IS
 */

const Promise             = require("bluebird");
const rp                  = require('request-promise');
const googleMapsApiKey    = process.env.GOOGLE_MAPS_API_KEY;
const fields              = require('./lib/fields');
const sortingOptions  = require('../../../config/sorting.js').options;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Resource overview',
  addFields: fields,
  beforeConstruct: function(self, options) {
    if (options.resources) {
      self.resources = options.resources;

      options.addFields = [
        {
          type: 'select',
          name: 'resource',
          label: 'Resource (from config)',
          choices : options.resources
        }
      ].concat(options.addFields || [])
    }
  },
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['resource', 'displayType', 'fallBackToMapImage', 'defaultImage', 'rawInput', 'pathForResource']
      },
      {
        name: 'gridder',
        label: 'Uitklapper',
        fields: ['gridder_text_open', 'gridder_text_vote_button', 'gridder_open_text_vote_button', 'gridder_tile_image_aspect_ratio', 'gridder_use_field_as_title' ]
      },
      {
        name: 'sorting',
        label: 'Sorting & filtering',
        fields: ['displayFilterVoting','defaultSorting', 'selectedSorting', 'filterResources', 'filterClassName' ]
      },
    /*  {
        name: 'text',
        label: 'Text',
        fields: ['text_', 'text_', 'text_' ]
      },*/
    ]);

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'pagination.min', { when: 'always' });
       self.pushAsset('script', 'list-init', { when: 'always' });

     };

    const superPageBeforeSend = self.pageBeforeSend;

    const superLoad = self.load;
		self.load = function(req, widgets, next) {
      const promises = [];

			widgets.forEach((widget) => {
        const resource = widget.resource;
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        const sort = req.query.sort ? req.query.sort : 'createdate_desc';
        const jwt = req.session.jwt;

        promises.push(new Promise((resolve, reject) => {
          rp({
            uri: `${apiUrl}/api/site/${req.data.global.siteId}/${resource}?sort=${sort}`,
            headers: {
              "X-Authorization": `Bearer ${jwt}`,
              'Accept': 'application/json',
              "Cache-Control": "no-cache"
            },
            json: true
          })
          .then((response)  => {
            widget.activeResources = response;
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          })
        }));

        // Add function for rendering raw string with nunjucks templating engine
        // Yes this ia a powerful but dangerous plugin :), admin only
        widget.renderString = (data, activeResource) => {
            data.activeResource = activeResource;

            try {
              return self.apos.templates.renderStringForModule(req, widget.rawInput, data, self);
            } catch (e) {
              console.log('eee', e)
              return 'Error....'
            }
         }

			});


      Promise.all(promises)
        .then(function (response) {
          return superLoad(req, widgets, next);
        })
        .catch(function (err) {
          return superLoad(req, widgets, next);
        });
		}

     const superOutput = self.output;
     self.output = function(widget, options) {

       // add the label to the select sort options for displaying in the select box
       widget.selectedSorting = widget.selectedSorting ? widget.selectedSorting.map((sortingValue) => {
         const sortingOption = sortingOptions.find(sortingOption => sortingOption.value === sortingValue);
         return {
           value: sortingValue,
           label: sortingOption ? sortingOption.label : sortingValue
         }
       }) : [];

       widget.formatImageUrl = function (image, location, widget, width, height, crop, cookieConsent) {
         let url;
         if (image) {
           url = image + '/:/rs=w:'+ width + ',h:' + height;
           url =  crop ? url + ';cp=w:' + width + ',h:' + height : url;
         } else if (location && widget.fallBackToMapImage && cookieConsent) {
           url = `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${location.coordinates[0]},${location.coordinates[1]}&heading=151.78&key=${googleMapsApiKey}`;
         } else if (widget.defaultImage) {
           url = self.apos.attachments.url(widget.defaultImage);
         } else {
           url = '/img/placeholders/idea.jpg';
         }

         return url;
       }

       widget.getTitleText = function (resource, fieldname) {
         fieldname = fieldname || 'title';
         let value = resource;
         fieldname.split('\.').forEach((key) => {
           value = value[key]
         });
         value = value || '';
         return value;
       }

       if (widget.filterResources) {
         const resourceIds = widget.filterResources.split(',').map(function(item) {
          return parseInt(item.trim(), 10);
        });

         widget.activeResources = resourceIds.length > 0 ? widget.activeResources.filter(idea => ideaIds.indexOf(idea.id) !== -1) : widget.activeResources;
       }


       return superOutput(widget, options);
     };

  }
};
