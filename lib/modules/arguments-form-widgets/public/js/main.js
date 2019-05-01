$('.argument-form.not-logged-in textarea').click(function (ev) {
   ev.preventDefault();
   window.location.hash = 'login-required';
});
