apos.define('previous-next-button-block-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      loadOpenStadComponents(
        'previous-next-button-block',
        function() {
          var config = data.config;
          try {
            config = JSON.parse(config)
          } catch (err) {}
          var element = document.querySelector('.'+config.divId);
          OpenStadComponents['previous-next-button-block'].PreviousNextButtonBlock.renderElement(element, config);
        },
        data
      )
    }

  }
});
