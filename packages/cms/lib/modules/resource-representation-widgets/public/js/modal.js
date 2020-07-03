apos.define('apostrophe-resource-modal', {

  extend: 'apostrophe-modal',

  source: 'modal',

  construct: function(self, options) {

    self.afterHide = function() {
      alert('hiddhd')
    };

  }
});
