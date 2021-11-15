apos.define('openstad-user-remove-widgets', {
  extend:    'apostrophe-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {

      $widget.find('.user-remove-form').each(function () {

        var $form = $(this);

        //var rules = $form.data('form-validation');

        $form.validate({
          ignore:         '',
      //    rules:          rules,
          submitHandler:  function (form) {
            $(form).find('button[type="submit"]').val('Versturen...');
            $(form).find('button[type="submit"]').attr('disabled', true);

            $.ajax({
              url:      $(form).attr('action'),
              type:     'POST',
              data:     $(form).serialize(),
              dataType: 'json',
              success:  function (response) {
                //window.location = response.url;
                window.location.reload();// = response.url;
              },
              error:    function (response) {
                window.alert('Er ging iets fout bij het versturen, probeer het alstublieft opnieuw.');
                $(form).find('button[type="submit"]').val('Verstuur');
                $(form).find('button[type="submit"]').attr('disabled', false);
              },

            });
            return false;
          },
          errorPlacement: function (error, element) {
           // $(element).closest(".form-group").addClass('error').append(error);
          },
          success:        function (label) {
            $form.find(".form-group").removeClass('error');
          }
        });
      });

    }
  }
});
