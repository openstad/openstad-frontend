apos.define('choices-guide-result-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      loadOpenStadComponents(
        'choices-guide',
        function() {
          var config = data.config;
          try {
            config = JSON.parse(config)
          } catch (err) {}
          var element = document.querySelector('.'+config.divId);
          OpenStadComponents['choices-guide'].ChoicesGuideResult.renderElement(element, config);
        },
        data
      )
    }

  }
});
