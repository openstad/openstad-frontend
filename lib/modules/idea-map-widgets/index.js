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
        const markerStyle = null;
        widgets.forEach((widget) => {
            widget.mapConfig = self.createOverviewData(req.data.ideas, req.data, styles, markerStyle);
        });

        return superLoad(req, widgets, callback);
    }
  }
};
