/**
 * i
 * @type {[type]}
 */
apos.define('apostrophe-areas-editor', {
    construct: function(self, options) {
        //make sure only bound once, elements get added dynamically
        $('[data-apos-trash-item]').off('click');
        $('[data-apos-trash-item]').on('click', function () {
          return confirm('Are you sure to delete?');
        })

        self.enableInterval = function() {
            // set saveInterval to 1 sec instead of the default 5 seconds.
            self.saveInterval = setInterval(self.onInterval, 1000);
        };
    }
});
