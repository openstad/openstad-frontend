apos.define('resource-representation-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {

            initResourceVoteForms($widget);

            var map = self.createMap(data.mapConfig);

            self.addPolygon(data.mapConfig);
            self.setIdeaMarker(data.mapConfig);
        }
    }
});

function initResourceVoteForms ($widget) {
    $widget.find('.vote-toggle-form').animate({opacity:1}, 500);

    $widget.find('.vote-toggle-form').on('submit', function (ev) {
    ev.preventDefault();
    var $form = $(this);
    var $tr = $(this).closest('tr');

    $.ajax({
       url: $form.attr('action'),
     //  context: document.body,
       type: $form.attr('method'),
       data: $form.serialize(),
       dataType: 'json',
       success:function(response) {
         if (response.checked) {
           $form.find(".vote-approved-text").show();
           $form.find(".vote-unapproved-text").hide();
           $tr.removeClass('rejected');
         } else {
           $form.find(".vote-approved-text").hide();
           $form.find(".vote-unapproved-text").show();
           $tr.addClass('rejected');
         }
       },
       error:function(response) {
         alert('Er gaat iets mis: ' + response.responseJSON.error.message);
       },
     });

  });
}
