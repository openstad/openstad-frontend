function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}
var activeFilter = getCookie('plannenActiveFilter') || 0;


$(document).ready(function () {
	displayIdeaOnHash();
	activateFilter(activeFilter)

	$('#filterSelector').click(function () {
		console.log('this.selectedIndex', this.selectedIndex);
			activateFilter(this.selectedIndex);
	})
})

$(document).on('click', '.current-budget-images a', function (ev) {
	setTimeout(function() {
		displayIdeaOnHash();
	}, 1);
});


function displayIdeaOnHash () {
	var showIdeaId;
	var match = window.location.search.match(/ideaId=(\d+)/);
	if (match) {
		showIdeaId = match[1];
	};

	var match = window.location.hash.match(/ideaId-(\d+)/);
	if (match) {
		showIdeaId = match[1];
	};

	var isOpen =  $('#idea-' + showIdeaId).hasClass('selectedItem');

	var scrollToTop;
	var stickyHeight = $(window).width() > 767 ? 76 : 109;

	if (isOpen) {
		scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;

		$([document.documentElement, document.body]).animate({
        scrollTop: scrollToTop
    }, 200);
	} else {

		if (showIdeaId && document.querySelector('#idea-' + showIdeaId) && document.querySelector('#idea-' + showIdeaId).querySelector('.button-more-info')) {
			document.querySelector('#idea-' + showIdeaId).querySelector('.button-more-info').click();
			setTimeout(function() {
				scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;
				console.log('----> scrollToTop', scrollToTop);

				$([document.documentElement, document.body]).stop().animate({
						scrollTop: scrollToTop
				}, 100);

			})
		}
	}
//	return false;
}

function activateFilter(which) {
	activeFilter = which;

	var filterSelector =	document.getElementById('filterSelector');
	if (filterSelector) {
		document.cookie = 'plannenActiveFilter=' + activeFilter;
		document.getElementById('filterSelector').selectedIndex = activeFilter;
		if (document.getElementById('filterSelector').selectedIndex == '0') {
			document.getElementById('filterSelector').options[0].innerHTML = 'Filter op gebied';
		} else {
			document.getElementById('filterSelector').options[0].innerHTML = 'Alle gebieden';
		}

		if (activeFilter == 0) {
			document.getElementById('themaSelector0').className += ' active';
			document.getElementById('filterSelector').className = document.getElementById('filterSelector').className.replace(/ ?active/g, '');
		} else {
			document.getElementById('themaSelector0').className = document.getElementById('themaSelector0').className.replace(/ ?active/g, '');
			document.getElementById('filterSelector').className += ' active';
		}

		updateDisplay();
	}
}


function updateDisplay() {
	// var activeThema = document.getElementById('themaSelector' + activeTab).innerHTML;
	var activeGebied = document.getElementById('filterSelector').value;

	var elements = document.getElementsByClassName('idea-item');
	Array.prototype.forEach.call(elements, function(element) {
		// var elementThema = element.querySelector('.thema') && element.querySelector('.thema').innerHTML;
		var elementGebied = element.querySelector('.gebied') && element.querySelector('.gebied').innerHTML;
		//if ((( !activeTab || activeTab == 0 ) || activeThema == elementThema) && (( !activeFilter || activeFilter == 0 ) || activeGebied == elementGebied)) {
		if (!activeFilter || activeFilter == 0 || activeGebied == elementGebied) {
			element.style.display = 'inline-block';
		} else {
			element.style.display = 'none';
		}
	});
}


$(document).ready(function () {
	if (window.ideaId) {
		showVoteCreator()
		selectIdea(window.ideaId, true);
	}
})

function deactivateAll() {
	// activateTab(0)
	activateFilter(0)
}

function handleClick(event) {

	console.log('aaaa ininin');

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
	if (isPhone) {
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
	console.log('aaaa ininin');


  if ( ideaElement && button ) {
		console.log('ininin');


		// if button == 'more info' use gridder
		// if (button.className == 'button-more-info') {
		//  	return;
		// }

		// if button == 'stem'
		if (button.className == 'button-vote') {
			var match = ideaElement.id.match(/idea-(\d+)/)
			if (match) {
				// TODO: wat je hier moet doen moet niet hardcoded zijn
				selectIdea(match[1])

				// cancel gridder
				if (mouseOverLayer) {
					event.stopPropagation()
					event.stopImmediatePropagation()
				}

			}
		}

	}

	// cancel gridder
	// if (mouseOverLayer) {
	//  	event.stopPropagation()
	//  	event.stopImmediatePropagation()
	// }

}
