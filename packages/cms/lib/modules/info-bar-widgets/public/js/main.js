apos.define('info-bar-widgets', {
  extend: 'openstad-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {
      var infobars = openstadGetCookie('hidden-info-bars') || [];
      /*
        HIDE SERVER SIDE

        for (var i = 0; i < infobars.length; i++) {
          var infobarId = infobars[i];
          $('#' + infobarId).remove();
        }
       */
      $widget.find('.info-bar .close-button').click(function () {
        var $infobar = $(this).closest('.info-bar')
        var infobarId = $infobar.attr('id');
        $infobar.remove();
        infobars.push(infobarId);
        openstadSetCookie('hidden-info-bars', infobars);
      });
    }
  }
});
