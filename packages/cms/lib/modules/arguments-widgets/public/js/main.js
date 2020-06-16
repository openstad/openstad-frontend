/**
 * Make sure after creating the user is scrolled to the comment
 */
window.onload = function() { // using (function {} {})() happens too early
  var arguments = $('.argument');
  if (arguments.length > 0) {
    var hash = window.location.hash;
    if (hash.startsWith('#arg') && $(hash).length >0) {
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 600, function() { });
    }
  }


};

$(document).ready(function() {
  $('body').on('click',  '.argument-edit, .argument-edit-cancel', function (ev) {
      ev.preventDefault();
      $(this).closest('.argument').toggleClass('edit-mode');
  });

  $('body').on('click', '.reaction-edit, .reaction-edit-cancel', function (ev) {
      ev.preventDefault();
      $(this).closest('.reaction').toggleClass('edit-mode');
  });

  $('body').on('click', '.reply-click', function (ev) {
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

})
