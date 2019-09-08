/**
 * Show not logged in users the message they have to login
 */
$('.argument-form.not-logged-in textarea').click(function (ev) {
//   ev.preventDefault();
  // window.location.hash = 'login-required';
});

/**
 * Handle form validation and submit form with ajax
 */
$(document).ready(function(){
    var argumentsValidator = $('.argument-form').each(function () {
    var $form = $(this);
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
            var orginalUrl = location.protocol+'//'+location.host+location.pathname;
            window.location.href = orginalUrl + '#arg' + response.id;
            window.location.reload(true);
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
        // You can bind to events that the forms/elements trigger on validation
    $form.bind('formValidation', function(event, element, result) {
      console.log(['validation ran for form:', element, 'and the result was:', result]);
    });
  });
});
