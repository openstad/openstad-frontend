apos.define('arguments-form-widgets', {
  extend: 'openstad-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {
      $widget.find('.argument-form').each(function(){
        bindArgumentValidation($(this));
      });

      $widget.on('submit', '.argument-form', function (ev) {
        ev.preventDefault();
        var $form = $(this);
        //clean up, in case already submitted before
       self.submit($form);
      });
    }

    self.submit = function($form) {
      $form.unbind();
      $form.data("validator", null);
      bindArgumentValidation($form);
      $form.submit();
    }
  }
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
