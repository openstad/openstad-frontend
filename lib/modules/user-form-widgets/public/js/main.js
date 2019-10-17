apos.define('user-form-widgets', {
    extend:    'apostrophe-widgets',
    construct: function (self, options) {
        self.play = function ($widget, data, options) {
            initFilePond();
            
            $widget.find('.user-form').each(function () {
                
                var $form = $(this);
                
                var rules = $form.data('form-validation');
                
                $form.validate({
                                   ignore:         '',
                                   rules:          rules,
                                   submitHandler:  function (form) {
                                       $(form).find('input[type="submit"]').val('Versturen...');
                                       $(form).find('input[type="submit"]').attr('disabled', true);
                        
                                       $.ajax({
                                                  url:      $(form).attr('action'),
                                                  type:     'POST',
                                                  data:     $(form).serialize(),
                                                  dataType: 'json',
                                                  success:  function (response) {
                                                      window.location = response.url;
                                                  },
                                                  error:    function (response) {
                                                      window.alert('Er ging iets fout bij het versturen, probeer het alstublieft opnieuw.');
                                                      $(form).find('input[type="submit"]').val('Verstuur');
                                                      $(form).find('input[type="submit"]').attr('disabled', false);
                                                  },
                            
                                              });
                                       return false;
                                   },
                                   errorPlacement: function (error, element) {
                                       $(element).closest(".form-group").addClass('error').append(error);
                                   },
                                   success:        function (label) {
                                       $form.find(".form-group").removeClass('error');
                                   }
                               });
            });
        }
    }
});
