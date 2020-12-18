$(document).ready(function() {
  $('.refresh-captcha').on('click', function () {
    var src = $('.captcha-img').attr('src');
    var currentTime = new Date().getTime();
    // if multiple refreshes just keep adding, no need to replace
    src = src.includes('?') ? '&refresh=' + currentTime: '?refresh=' + currentTime;
    $('.captcha-img').attr('src', src)
  });
})
