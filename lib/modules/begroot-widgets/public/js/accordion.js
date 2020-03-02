(function($) {
//  $('.mobile-accordion-header, .mobile-accordion-header:hidden').on('click', function (ev) {
  $(document.body).on('click', '.mobile-accordion-header', function (ev) {
    ev.preventDefault();
    $(this).closest('.mobile-accordion').toggleClass('open');
  });
})(jQuery);
