$(function() {
  // keep this one first in case a browser crashes on new JS syntax.
  initBrowserWarning();

  initHideFlash();
  initToggleMenuVisibility();
  initLogoutMijnOpenstad();
});

function initLogoutMijnOpenstad() {
  $('.logout-button').click(function (ev) {
    ev.preventDefault();

    var addressValue = $(this).attr("href");
    logoutMijnOpenstad({
      success: function () {
        console.log('succes logout');
        window.location.href = addressValue;
      },
      error: function (err) {
        console.log('error logout', err);
        window.location.href = addressValue;
      }
    })
  });
}

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

function logoutMijnOpenstad(options) {
  $.ajax({
    url: authServerLogoutUrl,
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    beforeSend: function(request) {
      request.setRequestHeader("Content-type", "application/json");
      request.setRequestHeader("Accept", "application/json");
    },
    success: options.sucess,
    error: options.error,
  });
}

function initBrowserWarning() {
  var isBelowIE11 =  true; //false;

  if (isBelowIE11) {
    $('body').prepend('<div class="browser-warning"> U gebruikt een verouderde versie van uw browser, Internet Explorer. We kunnen daarom niet garanderen dat deze website naar behoren werkt voor u. </div>')
  }
}
