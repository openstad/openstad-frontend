

$(document).ready(function () {
  var infobars = openstadGetCookie('hidden-info-bars') || [];
/*
  HIDE SERVER SIDE

  for (var i = 0; i < infobars.length; i++) {
    var infobarId = infobars[i];
    $('#' + infobarId).remove();
  }
 */
  $('.info-bar .close-button').click(function () {
    var $infobar = $(this).closest('.info-bar')
    var infobarId = $infobar.attr('id');
    $infobar.remove();
    infobars.push(infobarId);
    openstadSetCookie('hidden-info-bars', infobars);
  });
});
