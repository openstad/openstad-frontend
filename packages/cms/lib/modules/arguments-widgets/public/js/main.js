apos.define('arguments-widgets', {
  extend: 'openstad-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {
      var arguments = $widget.find('.argument');
      if (arguments.length > 0) {
        var hash = window.location.hash;

        /**
         * Make sure after creating the user is scrolled to the comment
         */
        if (hash.startsWith('#arg') && $(hash).length >0) {
          $('html, body').animate({
            scrollTop: $(hash).offset().top
          }, 600, function() { });
        }
      }

      $widget.on('submit', '.argument-form', function (ev) {
        ev.preventDefault();
        var $form = $(this);
        //clean up, in case already submitted before
        apos.modules['arguments-form-widgets'].submit($form);
      });

      $widget.on('click',  '.argument-edit, .argument-edit-cancel', function (ev) {
        ev.preventDefault();
        $(this).closest('.argument').toggleClass('edit-mode');
      });

      $widget.on('click', '.reaction-edit, .reaction-edit-cancel', function (ev) {
        ev.preventDefault();
        $(this).closest('.reaction').toggleClass('edit-mode');
      });

      $widget.on('click', '.reply-click', function (ev) {
        ev.preventDefault();

        if ($(this).hasClass('logged-in')) {
          var $replyForm = $(this).closest('.argument').find('.reply-form');
          var $argument = $(this).closest('.argument-container');
          var $replyForm = $argument.find('.reply-form');

          if ($replyForm.hasClass('active')) {
            $replyForm.removeClass('active');
          } else {
            $replyForm.addClass('active');
            $replyForm.find('textarea').focus();
          }
        }
      })
    }
  }
});
