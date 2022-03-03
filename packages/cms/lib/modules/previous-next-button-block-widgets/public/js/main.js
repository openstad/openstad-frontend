apos.define('previous-next-button-block-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      let config = data.config;
      try {
        config = JSON.parse(config)
      } catch (err) {}
      let element = document.querySelector('.openstad-component-previous-next-button-block');
      OpenStadComponents['previous-next-button-block'].PreviousNextButtonBlock.renderElement(element, config);
    }

  }
});
