apos.define('arguments-block-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      let config = data.config;
      try {
        config = JSON.parse(config)
        config.ideaId = options.activeResourceId
      } catch (err) {}
      let element = document.querySelector('.'+config.divId);
      OpenStadComponents['reactions'].Reactions.renderElement(element, config);
    }

  }
});
