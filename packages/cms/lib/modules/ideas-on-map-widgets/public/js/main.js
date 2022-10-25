apos.define('ideas-on-map-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      loadOpenStadComponents({
        component: 'ideas-on-map',
        onLoad: () => {
          let config = data.config;
          try {
            config = JSON.parse(config)
          } catch (err) {}
          let element = document.querySelector('.'+config.divId);
          OpenStadComponents['ideas-on-map'].IdeasOnMap.renderElement(element, config);
        },
        data,
      })
    }

  }
});
