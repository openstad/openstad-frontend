$(function() {

	// Call Gridder
	try {
	$('.gridder').gridderExpander({
    scroll: true,
    scrollOffset: 100,
    scrollTo: "panel",                  // panel or listitem
    animationSpeed: 300,
    animationEasing: "easeInOutExpo",
    showNav: true,                      // Show Navigation
    nextText: "<span></span>", // Next button text
    prevText: "<span></span>", // Previous button text
    closeText: "", // Close button text                // Close button text
    onStart: function(target) {

			console.log('fsdsdfsdfsfd');
			var stickyHeight = $(window).width() > 767 ? 76 : 109;

			var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging
			this.scrollOffset = stickyHeight - 12;// isPhone ? -40 : 100;
		},
    onContent: function(args){

			var element = args[0];
			var ideaId = element.querySelector('.this-idea-id').innerHTML;

			window.history.replaceState({}, '', '#showidea-' + ideaId);

			// todo: dit moet natuurlijk inde css, maar ik weet zo ff niet hoe
			var el = element.querySelector('#image-location-toggable-' + ideaId);
			if (el) {
			  el.style.height = ( 9 * el.querySelector('.idea-image-container').offsetWidth / 16 ) + 'px';
			}

			return false;

		},
    onClosed: function(){
			window.history.replaceState({}, '', '#');
		}
  });
	} catch(err) {console.log(err);}
});
