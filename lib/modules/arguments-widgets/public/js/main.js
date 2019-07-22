/**
 * Make sure after creating the user is scrolled to the comment
 */
window.onload = function() { // using (function {} {})() happens too early
  var arguments = $('.argument');
  if (arguments.length > 0) {
    var hash = window.location.hash;
    if (hash.startsWith('#arg') && $(hash).length >0) {
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 600, function() { });
    }
  }
};
