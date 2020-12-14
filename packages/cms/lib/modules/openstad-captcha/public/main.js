
$(document).ready(function () {
  $('.captcha-refresh').on('click', function (ev) {
    ev.preventDefault();
    var captchaSrc = $('.captcha-img').attr('src');

    // set refresh with time so it's always unique url on refresh
    $('.captcha-img').attr('src', captchaSrc+ '?refresh=1')
  });
})
