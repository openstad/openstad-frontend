$(document).ready(function() {
  // on refresh reload the captcha image
  $('.captcha-refresh').on('click', function (ev) {
    ev.preventDefault();
    var src = $('.captcha-img').attr('src');
    var currentTime = new Date().getTime();
    // if multiple refreshes just keep adding, no need to replace
    src = src.includes('?') ? src + '&refresh=' + currentTime: src + '?refresh=' + currentTime;
    $('.captcha-img').attr('src', src)
  });
})
