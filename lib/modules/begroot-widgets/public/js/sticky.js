// Get the stickyBar
(function($) {
  var $stickyBar = $('.sticky-bar');
  var stickyBarOffset = $stickyBar.offset().top + $stickyBar.height();


  function calculateContainerHeight() {
    console.log($('.sticky-bar').height());
    var height = $('.sticky-bar-container .sticky-bar').height();
    $('.sticky-bar-container').css('min-height', $('.sticky-bar').height() + 'px');
    stickyBarOffset = $stickyBar.offset().top + $stickyBar.height();
  }

  calculateContainerHeight();
  // When the user scrolls the page, execute myFunction
  window.onscroll = function () {
    if (window.pageYOffset > stickyBarOffset) {
      if (!$stickyBar.hasClass('open')) {
        $stickyBar.addClass("closed");
      }

      $stickyBar.addClass("sticky");
    } else {
      $stickyBar.removeClass("sticky");
      $stickyBar.removeClass("open closed");
      setTimeout(function () {
        if (!$stickyBar.hasClass('sticky')) {
          calculateContainerHeight();
        }
      }, 500);
    }
  };

  $stickyBar.find('.expand').on('click', function (ev) {
    ev.preventDefault();
    $stickyBar.addClass("open");
    $stickyBar.removeClass("closed");
  });

  $stickyBar.find('.contract').on('click', function (ev) {
    ev.preventDefault();
    $stickyBar.addClass("closed");
    $stickyBar.removeClass("open");
  });

  $('#next-button, #previous-button, .button-add-idea-to-budget').on('click', function (ev) {
    setTimeout(function () {
      if (!$stickyBar.hasClass('sticky')) {
        calculateContainerHeight();
      }
    }, 50);
  });

})(jQuery);
