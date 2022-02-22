apos.define('choices-guide-widgets', {
  extend: 'openstad-components-widgets',
  construct: function (self, options) {

    self.play = function (widget, data, options) {
      let config = data.config;
      try {
        config = JSON.parse(config)
      } catch (err) {}
      let element = document.querySelector('.openstad-component-choices-guide');
      OpenStadComponents['choices-guide'].ChoicesGuide.renderElement(element, config);
    }

  }
});
