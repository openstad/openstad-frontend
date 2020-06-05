/**
 * Show not logged in users the message they have to login
 */
$('.argument-form.not-logged-in textarea').click(function (ev) {
//   ev.preventDefault();
  // window.location.hash = 'login-required';
});

function bindArgumentValidation ($form){
  $form.validate({
    ignore: '',
    rules: {
      description : {
        required: true,
        minlength: 30,
        maxlength: 500
      },
      validateImages: {
        validateFilePond: true
      },
    },
    submitHandler: function(form) {
      $(form).find('input[type="submit"]').val('Verzenden...');
      $(form).find('input[type="submit"]').attr('disabled', true);

     $.ajax({
        url: $(form).attr('action'),
        type: 'POST',
        data: $(form).serialize(),
        dataType: 'json',
        success:function(response) {
          if ($(form).hasClass('ajax-refresh-after-submit')) {
            ajaxRefresh();
          } else {
            var orginalUrl = location.protocol+'//'+location.host+location.pathname;
            window.location.href = orginalUrl + '#arg' + response.id;
            window.location.reload(true);
          }
        },
        error:function(response) {
          alert('Er gaat iets mis met opslaan van het argument');
            // "this" the object you passed
          $(form).find('input[type="submit"]').val('Verzenden');
          $(form).find('input[type="submit"]').attr('disabled', false);
        },

      });
      return false;
     //form.submit();
    },
    errorPlacement: function(error, element) {
      $(element).closest(".form-group").addClass('error')
      error.insertAfter(element);
    },
    success: function (label) {
      $form.find(".form-group").removeClass('error');
    }
  });
}

/**
 * Handle form validation and submit form with ajax
 */
$(document).ready(function(){
    $('.argument-form').each(function(){
      bindArgumentValidation($(this));
    });
    $('body').on('submit', '.argument-form', function (ev) {
      ev.preventDefault();
      var $form = $(this);
      //clean up, in case already submitted before
      $form.unbind();
      $form.data("validator", null);
      bindArgumentValidation($form);
      $form.submit();
    });
});
