const Promise             = require("bluebird");
const googleMapsApiKey    = process.env.GOOGLE_MAPS_API_KEY;
const sortingOptions      = require('../../../config/sorting.js').options;
const ideaStates          = require('../../../config/idea.js').states;

const fields = [
      {
        name: 'recource',
        label: 'Recource ',
        type: 'select',
        choices: [
          {
            label: 'Ideas',
            value: 'ideas',
          },
          {
            label: 'Articles',
            value: 'articles',
          }
        ]
      },
      {
        name: 'displayType',
        label: 'Type ',
        type: 'select',
        choices: [
          {
            label: 'Minimum stemmen (stemvan type)',
            value: 'minimalVotes',
          },

          {
            label: 'Uitklap',
            value: 'gridder',
          },
          {
            label: 'Row',
            value: 'row',
          },
          {
            label: 'Raw',
            value: 'raw',
          },
        ]
      },
      {
        name: 'fallBackToMapImage',
        label: 'Fall back to map image if no image available?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true,
            showFields: []
          },
          {
            label: 'No',
            value: false,
          }
        ]
      },
      {
        name: 'defaultImage',
        type: 'attachment',
        label: 'Default image',
        trash: true
      },
      {
        name: 'showVoteCounter',
        label: 'Show vote counter (for gridder)',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          }
        ]
      },
      {
        name: 'displayRanking',
        label: 'Display ranking',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          }
        ]
      },
      {
        name: 'amountCharsSummary',
        label: 'Amount of characters for the summary',
        type: 'string',
        def: '60'
      },
      {
        name: 'rawInput',
        label: 'Raw input',
        type: 'string',
        textarea: true
      },

      {
        name: 'gridder_text_open',
        label: 'Text for hover on image',
        type: 'string'
      },
      {
        name: 'gridder_tile_image_aspect_ratio',
        label: 'Aspect ratio of images in tiles',
        type: 'string',
        def: '1:1',
      },
      {
        name: 'gridder_use_field_as_title',
        label: 'Which field should be used as title for an idea',
        type: 'string',
        def: 'title',
      },
      {
        type: 'checkboxes',
        name: 'selectedSorting',
        label: 'Select sorting available (check one or more)',
        choices: sortingOptions
      },
      {
        type: 'select',
        name: 'defaultSorting',
        label: 'Select the default sorting (needs to be checked)',
        choices: sortingOptions
      },
      {
        type: 'string',
        name: 'filterIdeas',
        label: 'Show only following ideas: (idea id\'s, comma seperated)',
      },
      {
        name: 'filterClassName',
        type: 'select',
        label: 'Select styling class for filter and sorting',
        choices: [
          {
            label: 'Default',
            value: 'filterDefault',
          },
          {
            label: 'Clean',
            value: 'filterClean',
          },
        ]
      },
      {
        name: 'displayFilterVoting',
        label: 'Display filter & sorting?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
        def: true
      },
    ].concat(
      ideaStates.map((state) => {
        return {
          type: 'string',
          name: 'label' +  state.value,
          label: 'Label for: ' + state.value,
        }
      })
  );

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Ideas',
  addFields: fields,
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['recource', 'displayType', 'fallBackToMapImage', 'defaultImage']
      },
      {
        name: 'gridder',
        label: 'Uitklapper',
        fields: ['gridder_text_open', 'gridder_text_vote_button', 'gridder_open_text_vote_button', 'gridder_tile_image_aspect_ratio', 'gridder_use_field_as_title' ]
      },
      {
        name: 'sorting',
        label: 'Sorting & filtering',
        fields: ['displayFilterVoting','defaultSorting', 'selectedSorting', 'filterIdeas', 'filterClassName' ]
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
       self.pushAsset('stylesheet', 'tile', { when: 'always' });
       self.pushAsset('stylesheet', 'grid', { when: 'always' });
       self.pushAsset('stylesheet', 'duration', { when: 'always' });

       self.pushAsset('stylesheet', 'vote-creator', { when: 'always' });
       self.pushAsset('stylesheet', 'gridder', { when: 'always' });
       self.pushAsset('stylesheet', 'nr-of-votes', { when: 'always' });
       self.pushAsset('script', 'thumbnail-tile-loading', { when: 'always' });
       self.pushAsset('script', 'tabs', { when: 'always' });
       self.pushAsset('script', 'fotorama', { when: 'always' });
       self.pushAsset('script', 'vote', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
       self.pushAsset('script', 'jquery.gridder.min', { when: 'always' });
       self.pushAsset('script', 'ideas-lister', { when: 'always' });
     };

    const superPageBeforeSend = self.pageBeforeSend;

    const superLoad = self.load;
		self.load = function(req, widgets, next) {
      const promises = [];

			widgets.forEach((widget) => {
        const recource = data.widget.recource;
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        const sort = req.query.sort ? req.query.sort : 'createdate_desc';
        const jwt = req.session.jwt;

        promises.push(rp({
            uri: `${apiUrl}/api/site/${req.data.global.siteId}/${recource}?sort=${sort}&includeVoteCount=1&includeUserVote=1`,
            headers: {
              "X-Authorization": `Bearer ${jwt}`,
              'Accept': 'application/json',
              "Cache-Control": "no-cache"
            },
            json: true
        }));

        Promise.all(promises)
          .then(function (response) {
            console.log('response =>>', response);
            data.widget.activeItems = response;
            return superLoad(req, widgets, next);
          })
          .catch(function (err) {
            console.log('err =>>', err);
            return superLoad(req, widgets, next);
          });

          widget.renderString = (data) => {
            try {
              return self.apos.templates.renderStringForModule(req, widget.rawInput, data, self);
            //  return self.apos.templates.nunjucks.renderString(widget.rawInput, data)
            } catch (e) {
              return 'Error....'
            }
          }
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

       widget.getTitleText = function (idea, fieldname) {
         fieldname = fieldname || 'title';
         let value = idea;
         fieldname.split('\.').forEach((key) => {
           value = value[key]
         });
         value = value || '';
         return value;
       }

       if (widget.filterIdeas) {
         const ideaIds = widget.filterIdeas.split(',').map(function(item) {
          return parseInt(item.trim(), 10);
        });

         widget.ideas = ideaIds.length > 0 ? widget.ideas.filter(idea => ideaIds.indexOf(idea.id) !== -1) : widget.ideas;
       }

       return superOutput(widget, options);
     };

  }
};
