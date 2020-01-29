module.exports = {
  extend: 'map-widgets',
  label: 'Ideas map',
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


  ],
  construct: function(self, options) {
    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
      self.pushAsset('script', 'main', { when: 'always' });
    };

    const superLoad = self.load;
    self.load = (req, widgets, callback) => {
        const styles = self.apos.settings.getOption(req, 'openStadMap').defaults.styles;
        const globalData = req.data.global;
        const googleMapsApiKey = self.apos.settings.getOption(req, 'googleMapsApiKey');

        widgets.forEach((widget) => {
            widget.mapConfig = self.getMapConfigBuilder(globalData)
                .setDefaultSettings({
                    mapCenterLat: globalData.mapCenterLat,
                    mapCenterLng: globalData.mapCenterLng,
                    mapZoomLevel: globalData.mapZoomLevel,
                    styles: styles,
                    googleMapsApiKey: googleMapsApiKey
                })
                .setPolygon(globalData.mapPolygons)
                .setMarkersByIdeas(req.data.ideas)
                .getConfig()
        });

        return superLoad(req, widgets, callback);
    }
  }
};
