(function($) {
	// Call Gridder
  if ( !document.querySelector('#multiple-voting-container') ) return;
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
			var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging
			this.scrollOffset = isPhone ? -40: 100;
		},
    onContent: function(args){

			var element = args[0];
			var ideaId =  element && element.querySelector('.this-idea-id') ? element.querySelector('.this-idea-id').innerHTML : false;
			window.history.replaceState({}, '', '#ideaId-' + ideaId);

			// function is defined in apostrophe-assets
			// might be better to move to events
			initImagesGallery();

			var $mapContainer = $(element).find('.map-container');

			$('body').trigger('openGridder');

			return false;
		},
    onClosed: function(){
		$('body').trigger('closeGridder');
		window.history.replaceState({}, '', '#');
    }
  });
})(jQuery);

var currentOverlay;
function ideaListClick(event) {
	// search for the element clicked
  var target = event.target;
	var mouseOverLayer;
	var ideaElement;
	var button;


  while ( target.tagName != 'HTML' ) {
    if ( target.className.match(/gridder-mouse-over|info/) ) {
      mouseOverLayer = target;
    }
    if ( target.className.match(/button-more-info|button-vote/) ) {
      button = target;
    }
    if ( target.className.match('gridder-list') ) {
      ideaElement = target;
      break;
    }
    target = target.parentNode || target.parentElement;
  }

	var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging
	// on phone first click shows moseover, second acually shows something
	if (isPhone && mouseOverLayer) {
		if (mouseOverLayer.className.match(/ showFirst/)) {
			mouseOverLayer.className = mouseOverLayer.className.replace(' showFirst', '');
			mouseOverLayer.style.display = 'none';
		} else {
			mouseOverLayer.className += ' showFirst';
			event.stopPropagation()
			event.stopImmediatePropagation()
			return;
		}
	}

  if ( ideaElement && button ) {

		// if button == 'stem'
		if (button.className == 'button-vote') {
			var match = ideaElement.id.match(/idea-(\d+)/)

			if (match) {
				// cancel gridder
				if (mouseOverLayer) {
					event.stopPropagation()
					event.stopImmediatePropagation()
				}

			}
		}

	}

}

function scrollToIdeas() {
	// Find first matching element for ideas list
    var el = document.querySelectorAll('#ideasList, #ideas-anchor, #ideaList').item(0);
    scrollToResolver(el);
}

function scrollToResolver(elem) {
	if (elem) {
	  var jump = parseInt(elem.getBoundingClientRect().top * .2);
	  document.body.scrollTop += jump;
	  document.documentElement.scrollTop += jump;
	  if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
	    elem.lastjump = Math.abs(jump);
	    setTimeout(function() { scrollToResolver(elem);}, 25);
	  } else {
	    elem.lastjump = null;
	  }
	}
}
