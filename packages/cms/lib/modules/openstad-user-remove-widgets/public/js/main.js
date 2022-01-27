apos.define('openstad-user-remove-widgets', {
  extend:    'apostrophe-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {

      $widget.find('.user-remove-form').each(function () {

        var $form = $(this);

        //var rules = $form.data('form-validation');

        var confirmationCheck = function(){
          var confirmationSentence = $('.confirmation-sentence').text().trim().toLowerCase();

          if (confirmationSentence === $widget.find('.confirmation-input').val().trim().toLowerCase()) {
            $widget.find('button[type="submit"]').attr('disabled', false)
          } else {
            $widget.find('button[type="submit"]').attr('disabled', true)
          }
        }

        $.validator.addMethod("siteRequired", function(value, elem, param) {
          return $(".sites:checked").length > 0;
        },"Selecteer ten minste 1 site");

        $widget.find('.confirmation-input').change(confirmationCheck);
        $widget.find('.confirmation-input').keyup(confirmationCheck);

        $form.validate({
          ignore:         '',
          rules: {
            'sites[]' : {
              siteRequired: true,
            },
          },
          submitHandler:  function (form) {
            var buttonText = $(form).find('button[type="submit"]').val();
            $(form).find('button[type="submit"]').val(buttonText + '...');

            $(form).find('button[type="submit"]').attr('disabled', true);

            $.ajax({
              url:      $(form).attr('action'),
              type:     'POST',
              data:     $(form).serialize(),
              dataType: 'json',
              success:  function (response) {
                //confirmationCheck();
                window.location.reload(); // = response.url;
              },
              error:    function (response) {
                confirmationCheck();
                window.alert('Er ging iets fout bij het versturen, probeer het alstublieft opnieuw.');
                $(form).find('button[type="submit"]').val(buttonTexts);
                $(form).find('button[type="submit"]').attr('disabled', false);
              },
            });
            return false;
          },
          errorPlacement: function (error, element) {
            $(element).closest(".form-group").addClass('error').append(error);
          },
          success:        function (label) {
           // confirmationCheck();
            $form.find(".form-group").removeClass('error');
          }
        });
      });

    }
  }
});
