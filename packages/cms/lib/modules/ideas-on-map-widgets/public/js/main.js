apos.define('ideas-on-map-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      let config = data.config;
      try {
        config = JSON.parse(config)
      } catch (err) {}
      let element = document.querySelector('.openstad-component-ideas-on-map');
      OpenStadComponents['ideas-on-map'].IdeasOnMap.renderElement(element, config);
    }

  }
});
