$(function() {
  // keep this one first in case a browser crashes on new JS syntax.
  initBrowserWarning();
  initAjaxForms();
  initHideFlash();
  initToggleMenuVisibility();
  initLogoutMijnOpenstad();
  initAdminHover();
  initRoleRequired();
  initFadeInOnReady();
  initNewsletterForm();
  initCloseModalWhenClickingOnBackground();
  initDataTables();
  initIdeaFormToSubmit();
});

function initLogoutMijnOpenstad() {
  $('.logout-button').click(function (ev) {
    ev.preventDefault();

    var addressValue = $(this).attr("href");
    logoutMijnOpenstad({
      success: function () {
        window.location.href = addressValue;
      },
      error: function (err) {
        window.location.href = addressValue;
      }
    })
  });
}

function initDataTables () {
  $('.data-table').dataTable({
    "pageLength" : 50,
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
  });
}

function initCloseModalWhenClickingOnBackground () {
  $('.content-modal').on('click', function (ev) {
    // only close if click is directly on the parent container
    if ($(ev.target).hasClass('content-modal')) {
      window.location.hash = '#closed';
    }
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

function initAjaxForms () {
  $('.ajax-form').animate({opacity:1}, 500);

  $('.ajax-form').on('submit', function (ev) {
    ev.preventDefault();
    var $form = $(this);
    var redirectUrl = $(this).find('.redirect-url').val();
    var $submitButtons = $form.find('input[type="submit"], button[type="submit"]');
    $submitButtons.attr('disabled', true);

    $.ajax({
       url: $form.attr('action'),
     //  context: document.body,
       type: $form.attr('method'),
       data: $form.serialize(),
       dataType: 'json',
       success:function(response) {
         if (redirectUrl) {
           window.location.replace(redirectUrl);
         } else {
           window.location.hash = "";
           window.location.reload();
         }

      //   $submitButtons.attr('disabled', false);

       },
       error:function(response) {
         var message = response.responseJSON && response.responseJSON.message ? response.responseJSON.message : false;
         var errorMessage = response.responseJSON && response.responseJSON.error && response.responseJSON.error.message ? response.responseJSON.error.message : false;

         $submitButtons.attr('disabled', false);

         if (message) {
           alert('Er gaat iets mis: ' + message);
         }

         if (errorMessage) {
           alert('Er gaat iets mis: ' + errorMessage);
         }
       },
     });

  });
}

/**
 * Take care of newsletter submitting logic: validation, error & success feedback & ajax submission
 */
function initNewsletterForm () {
  var $form = $('#newsletter-form');
  var $successMessage =  $form.find('.newsletter-success-message');
  var validator = $('#newsletter-form').validate({
    submitHandler: function(form) {
     var $submitButton = $(form).find('button[type="submit"]');
     var submitButtonText = $submitButton.text();
     //add ... and disabled so form cant be submitted
     $submitButton.text(submitButtonText + '...')
     $form.find('button[type="submit"]').attr('disabled', true);
     // hide the message
     $form.find('.error-message').empty().hide();
     $form.find('.success-message').empty().hide();

     $.ajax({
        url: $form.attr('action'),
        type: 'POST',
        data: $(form).serialize(),
        dataType: 'json',
        success:function(response) {
          $form.find('.success-message').text('Je bent ingeschreven!').show();
          // set text back to normal and make the button clickable again
          $submitButton.text(submitButtonText);
          $submitButton.attr('disabled', false);
        },
        error:function(error) {
            // get the error message
            var errorMessage =  error && error.responseJSON && error.responseJSON.message ? error.responseJSON.message : 'Er gaat iets mis...';
            $form.find('.error-message').text(errorMessage).show();
            // set text back to normal and make the button clickable again
            $submitButton.text(submitButtonText);
            $submitButton.attr('disabled', false);
        }
      });
      return false;
    },
    errorPlacement: function(error, element) {
      error.insertAfter(element);
    },
  });

}


function initAdminHover() {
  $('.apos-area-widget').hover(
         function(ev){
           ev.stopPropagation();
           $('.apos-area-widget').removeClass('hover');
          var $childEl = $(this).find('.apos-area-widget');
          // $(this).addClass('hover')
           if ($childEl.length > 0) {
             $childEl.addClass('hover');
           } else {
             $(this).addClass('hover');
           }
         },
         function(ev){
           var $this = $(this);
           $this.removeClass('hover')
         }
  );
}

function openstadGetStorage(name) {

  var value = localStorage.getItem(name);

  try {
    value = JSON.parse(value);
  } catch(err) {}

  return value;

}
function openstadSetStorage(name, value) {

  if ( typeof name != 'string' ) return;

  if ( typeof value == 'undefined' ) value = "";
  if ( typeof value == 'object' ) {
    try {
      value = JSON.stringify(value);
    } catch(err) {}
  };

  localStorage.setItem( name, value );
}


function initRoleRequired() {
  var userRole = openstadUserRole;

  $(".role-required-anonymous").on('click', function (ev) {
    // if no user role is set, redirect them to the anonymous role auth route
    if (!userRole) {
      ev.preventDefault();
      var loginUrl = '/oauth/login?useOauth=anonymous';
      loginUrl = $(this).attr('data-return-to') ? loginUrl + '&returnTo=' + encodeURIComponent($(this).attr('data-return-to')) : loginUrl;
      window.location.href = loginUrl;
    }
  });

  $(".role-required-member").on('click', function (ev) {
    if (userRole !== 'member' && userRole !== 'admin') {
      ev.preventDefault();
      //show login popup.
      var modalText = $(this).attr('data-modal-text');
      $('#login-required').find('.modal-login-text').text(modalText);
      location.hash = 'login-required';
      return false;
    }
  });

}

function initFadeInOnReady () {
  $(document).ready(function () {
    if ($('.opacity-0-for-load').length > 0) {
      $('.opacity-0-for-load').animate({opacity:1}, 500, function () {
        $('body').addClass('page-loaded');
      });
    } else {
      $('body').addClass('page-loaded');
    }

  	$('.hide-when-loaded').hide();

  });
}


function initIdeaFormToSubmit () {
  if (ideaFormToSubmit) {
    var $ideaFormToSubmit = $('#' + ideaFormToSubmit);
    if ($ideaFormToSubmit.length > 0) {
      $ideaFormToSubmit.find('button').click();
    }
  }
}
