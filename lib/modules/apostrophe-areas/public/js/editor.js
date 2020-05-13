/**
 * i
 * @type {[type]}
 */
var clickBound;

apos.define('apostrophe-areas-editor', {
    construct: function(self, options) {
        self.link('apos-trash-item', function () {
          return confirm('Are you sure to delete?')
        });

        self.enableInterval = function() {
            // set saveInterval to 1 sec instead of the default 5 seconds.
            self.saveInterval = setInterval(self.onInterval, 1000);
        };
    }
});
