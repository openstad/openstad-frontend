$(function() {
  initHideFlash();
  initToggleMenuVisibility();
});

function initHideFlash() {
  $('.flash-container .close-button').click(function() {
    $(this).closest('.flash-container').remove();
  });

  setTimeout(function() {
    $('.flash-container').remove();
  }, 5000);
}


function initToggleMenuVisibility () {
  $('.visibility-toggle').click(function (ev) {
    ev.preventDefault();
    var dataTarget = $(this).attr('data-target');
    var $target = $(dataTarget);
    var $button = $(this);
    var menusOpen = $('.visibility-toggle.active').length > 0 ? true : false;

    console.log('===> dataTarget', dataTarget);

    if ($target.is(':visible')) {
      $('.body-background').hide();
      $('.visibility-toggle').removeClass('active');
      $('.toggle-menu').removeClass('active').hide();
    } else {
      $('.visibility-toggle').removeClass('active');
      $('.toggle-menu').removeClass('active').hide();
      $('.body-background').show();
      $button.addClass('active');
      $target.addClass('active').show();
    }
  });

  $('.body-background').click(function(e) {
     $('.body-background').hide();
     $('.visibility-toggle').removeClass('active');
     $('.toggle-menu').removeClass('active').hide();
  });
}
