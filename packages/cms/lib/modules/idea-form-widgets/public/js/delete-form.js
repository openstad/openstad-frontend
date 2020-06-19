$('.idea-delete-form').on('submit', function (ev) {
  ev.preventDefault();

  var $form = $(this);
  $.ajax({
     url: $form.attr('action'),
   //  context: document.body,
     type: 'POST',
     data: $form.serialize(),
     dataType: 'json',
     success:function(response) {
         var redirect = $form.find('.idea-delete-redirect-uri').val();
         window.location.replace(redirect);
     },
     error:function(response) {
         // "this" the object you passed
         alert(response.responseJSON.msg);

     },
   });
});
