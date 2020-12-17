$(document).ready(function() {
  $('.refresh-captcha').on('click', function () {
    var src = $('.captcha-img').attr('src');
    var currentTime = new Date().getTime();
    src = src.includes('?') ? '&refresh=' + currentTime: '?refresh=' + currentTime;
    $('.captcha-img').attr('src', src + '')
  });
})
