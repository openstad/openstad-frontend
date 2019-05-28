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



/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function initBrowserWarning() {
  if (detectIE() && detectIE() < 11) {
    $('body').prepend('<div class="browser-warning"> U gebruikt een verouderde versie van uw browser, Internet Explorer. We kunnen daarom niet garanderen dat deze website naar behoren werkt voor u. </div>')
  }
}
