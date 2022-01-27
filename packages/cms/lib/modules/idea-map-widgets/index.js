/**
 * Overview of idea resources on a map
 */
const openstadMap = require('../../../config/map').default;

module.exports = {
  extend: 'map-widgets',
  label: 'Ideas map',
  adminOnly: true,
  addFields: [
    {
      name: 'displayCtaButton',
      type: 'boolean',
      label: 'Display CTA button',
      def: true,
      choices: [
        {
          value: true,
          label: "Yes",
          showFields: [
            'ctaUrl', 'ctaText'
          ]
        },
        {
          value: false,
          label: "No"
        },
      ]
    },
    {
      name: 'ctaUrl',
      type: 'string',
      label: 'CTA url',
      required: true
    },
    {
      name: 'ctaText',
      type: 'string',
      label: 'CTA text',
    //  required: true
    },
    {
      name: 'displayCounter',
      type: 'boolean',
      label: 'Display counter',
      def: true,
      choices: [
        {
          value: true,
          label: "Yes",
          showFields: [
            'counterText'
          ]
        },
        {
          value: false,
          label: "No"
        },
      ]
    },
    {
      name: 'counterText',
      type: 'string',
      label: 'Counter text',
    },
    {
      name: 'useMarkerLinks',
      type: 'boolean',
      label: 'Flags link to details page',
      def: true,
      choices: [
        {
          value: true,
          label: "Yes",
        },
        {
          value: false,
          label: "No"
        },
      ]
    },
    {
      type: 'boolean',
      name: 'autoCenter',
      label: 'Enable auto center (this option will automatically calculate the center of the map based on the markers and polygon)',
    },
    {
      type: 'string',
      name: 'filterIdeas',
      label: 'Show only following ideas: (idea id\'s, comma seperated)',
    },
    {
      type: 'string',
      name: 'filterExcludeThemes',
      label: 'Exclude ideas with this theme: (theme names, comma seperated)',
    },
    {
      type: 'string',
      name: 'filterIncludeThemes',
      label: 'Only show idea including this theme: (theme names, comma seperated)',
    },
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'map',
        label: 'Map',
        fields: ['useMarkerLinks', 'autoCenter']
      },
      {
        name: 'ctaButon',
        label: 'Call-To-Action button',
        fields: ['displayCtaButton', 'ctaUrl', 'ctaText']
      },
      {
        name: 'counter',
        label: 'Counter',
        fields: ['displayCounter', 'counterText']
      },
      {
        name: 'content',
        label: 'Content',
        fields: ['filterIdeas', 'filterExcludeThemes', 'filterIncludeThemes']
      }
    ]);

    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      self.pushAsset('script', 'main', { when: 'always' });
    };

    self.filterIdeas = (widget) => {
      if (widget.filterIdeas) {
        const ideaIds = widget.filterIdeas.split(',').map(function(item) {
         return parseInt(item.trim(), 10);
       });

        widget.ideas = ideaIds.length > 0 ? widget.ideas.filter(idea => ideaIds.indexOf(idea.id) !== -1) : widget.ideas;
      }

      // exclude ideas with a certain theme
      if (widget.filterExcludeThemes) {
        const excludeThemes = widget.filterExcludeThemes.split(',').map(function(item) {
         return item.trim();
       });

        widget.ideas = widget.ideas && excludeThemes.length > 0 ? widget.ideas.filter(idea => idea && idea.extraData && idea.extraData && excludeThemes.indexOf(idea.extraData.theme) === -1) : widget.ideas;
      }


      // only include ideas with a certain theme
      if (widget.filterIncludeThemes) {
         const includeThemes = widget.filterIncludeThemes.split(',').map(function(item) {
           return item.trim();
         });

         widget.ideas = includeThemes.length > 0 ? widget.ideas.filter(idea => idea && idea.extraData && idea.extraData && includeThemes.indexOf(idea.extraData.theme)  !== -1) : widget.ideas;
      }
    }

    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
        const styles = openstadMap.defaults.styles;
        const globalData = req.data.global;
        globalData.siteUrl = req.data.siteUrl;
        const googleMapsApiKey = self.apos.settings.getOption(req, 'googleMapsApiKey');


        widgets.forEach((widget) => {
          widget.ideas = req.data.ideas ? req.data.ideas.map((idea) => {
            return {
              location: idea.location,
              status: idea.status,
              id: idea.id,
              extraData: {
                theme: idea.extraData.theme
              }
            };
          }) : [];
          self.filterIdeas(widget);

          widget.mapConfig = self.getMapConfigBuilder(globalData)
            .setDefaultSettings({
              mapCenterLat: globalData.mapCenterLat,
              mapCenterLng: globalData.mapCenterLng,
              mapZoomLevel: globalData.mapZoomLevel,
              styles: styles,
              useMarkerLinks: widget.useMarkerLinks,
              googleMapsApiKey: googleMapsApiKey,
              autoCenter: widget.autoCenter
            })
            .setPolygon(globalData.mapPolygons)
            .setMarkersByResources(widget.ideas)
            .getConfig()
        });

        return superLoad(req, widgets, callback);
    }
  }
};
