apos.define('accordeon-widgets', {
  extend: 'openstad-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {

      $widget.find('.accordeon-item .title').on('click', function () {

        var $accordeonItem = $(this).closest('.accordeon-item');

        if ($accordeonItem.hasClass('closed')) {
          // Close all open items
          closeItem($('.accordeon-item:not(.closed)'));

          // Open the clicked item
          openItem($accordeonItem);
        } else {
          // Close all open items
          closeItem($widget.find('.accordeon-item:not(.closed)'));
        }
      });
    }

    function closeItem($el) {
      $el.addClass('closed').find('.description').css({maxHeight: 0});
    }

    function openItem($el) {
      // Get height of description and set it as maxheight on the accordeon item
      var height = $el.find('.description p').outerHeight();
      $el.removeClass('closed').find('.description').css({maxHeight: height});
    }
  }
});
