$(document).ready(function () {
	displayIdeaOnHash();
});

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
				$([document.documentElement, document.body]).stop().animate({
						scrollTop: scrollToTop
				}, 100);

			})
		}
	}
//	return false;
}

$(document).ready(function () {
	if (window.ideaId) {
		showVoteCreator();
		selectIdea(window.ideaId, true);
	}
})
