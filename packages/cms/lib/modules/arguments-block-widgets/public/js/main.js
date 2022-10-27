apos.define('arguments-block-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      loadOpenStadComponents(
        'reactions',
        function() {
          var config = data.config;
          try {
            config = JSON.parse(config)
            config.ideaId = options.activeResourceId || ( options.activeResource && options.activeResource.id ) || false;
          } catch (err) {}
          var element = document.querySelector('.'+config.divId);
          OpenStadComponents['reactions'].Reactions.renderElement(element, config);
        },
        data
      )
    }

  }
});
