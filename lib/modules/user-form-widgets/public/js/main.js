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
            
            $widget.find('.submission-overview-button').on('click', function () {
                var formId = $(this).data('form-id');
                
                var dataTable = $widget.find('#votes').DataTable();
                
                dataTable.clear().draw();
                
                $.get('/modules/user-form-widgets/submissions?form=' + formId)
                    .done(function (data) {
                        var rows = [];
                        $(data).each(function () {
                            var submittedData = '';
                            
                            $.each(this.submittedData, function (k, v) {
                                if (v.indexOf('http') !== -1) {
                                    v = '<a href="' + v + '" target="_blank">' + v + '</a>';
                                }
                                submittedData += '<strong>' + k + '</strong>:' + v + '<br />';
                            });
                            
                            rows.push([this.id, submittedData, this.createdAt]);
                        });
                        
                        dataTable.rows.add(rows).draw();
                    })
                    .fail(function (err) {
                        console.error('ajax', err);
                    });
            });
        }
    }
});
