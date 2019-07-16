$('.argument-form.not-logged-in textarea').click(function (ev) {
   ev.preventDefault();
   window.location.hash = 'login-required';
});

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
      //  console.log('X-CSRF-TOKEN');
      //  console.log('asdasdasdasd',$(form).serialize());

       $.ajax({
          url: $(form).attr('action'),
        //  context: document.body,
          type: 'POST',
          data: $(form).serialize(),
          dataType: 'json',
          success:function(response) {
              window.location.replace(window.location.href + '#arg' + response.id);
          },
          error:function(response) {
              // "this" the object you passed
            $(form).find('input[type="submit"]').val('Verzenden');
            $(form).find('input[type="submit"]').attr('disabled', false);
          },

        });
        return false;
       //form.submit();
      },
      errorPlacement: function(error, element) {
        console.log('aaaaaa', this);

//$(element).prev('div').addClass('error');
        $(element).closest(".form-group").addClass('error')
        error.insertAfter(element);


        //  if (element.attr("type") === "radio" || element.attr("type") === "checkbox") {
        //     error.insertAfter($(element).closest('.input-group'));
        //   } else {
        //     error.insertAfter(element);
        //   }
      },
      success: function (label) {
        $form.find(".form-group").removeClass('error');
      }
    /*  invalidHandler: function(form, validator) {

       if (!validator.numberOfInvalids()) {
           return;
       }

        var $firstErrorEl = $(validator.errorList[0].element).closest('.form-group');
        if ($firstErrorEl.length > 0) {
          var scrollOffset = parseInt($firstErrorEl.offset().top, 10);
          scrollOffset = scrollOffset;// - 1200;

          $('html, body').scrollTop(scrollOffset);
        }

      }*/
    });
        // You can bind to events that the forms/elements trigger on validation
    $form.bind('formValidation', function(event, element, result) {
      console.log(['validation ran for form:', element, 'and the result was:', result]);
    });
  });
});
