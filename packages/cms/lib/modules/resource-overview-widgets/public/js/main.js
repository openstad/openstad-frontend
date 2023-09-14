apos.define('resource-overview-widgets', {
  extend: 'map-widgets',
  construct: function (self, options) {
	
    self.playAfterlibsLoaded = function ($widget, data, options) {
      ideasOverviewDisplayIdeaOnHash();

      $(document).on('click', '.current-budget-images a', function (ev) {
        setTimeout(function () {
          ideasOverviewDisplayIdeaOnHash();
        }, 1);
      });

      if (window.ideaId) {
        showVoteCreator();
        selectIdea(window.ideaId, true);
      }

      if ($('#ideaList li').length) {
        // Make sure the gridder-mouse-over is visible when tabbing through the buttons
        $('li.gridder-list .gridder-mouse-over a').on('focus', function () {
          $(this).closest('.gridder-mouse-over').addClass('hovered');
        });
        $('li.gridder-list .gridder-mouse-over a').on('blur', function () {
          $(this).closest('.gridder-mouse-over').removeClass('hovered');
        });
      }

      $(document).on('openstadAjaxRefresh', function () {
        if (window.voteBlockIdentifier) {
          var ideaId = openstadGetCookie('ideaId' + voteBlockIdentifier);
          showVoteCreator();

          if (ideaId) {
            selectIdea(ideaId, true);
          }
        }
      });
    };

    function ideasOverviewDisplayIdeaOnHash() {
      var showIdeaId;
      var match = window.location.search.match(/ideaId=(\d+)/);

      if (match) {
        showIdeaId = match[1];
      }

      var match = window.location.hash.match(/ideaId-(\d+)/);
      if (match) {
        showIdeaId = match[1];
      }

      var isOpen = $('#idea-' + showIdeaId).hasClass('selectedItem');

      var scrollToTop;
      var stickyHeight = $(window).width() > 767 ? 76 : 109;

      if (isOpen) {
        scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;

        $([document.documentElement, document.body]).animate(
          {
            scrollTop: scrollToTop,
          },
          200
        );
      } else {
        if (
          showIdeaId &&
          document.querySelector('#idea-' + showIdeaId) &&
          document
            .querySelector('#idea-' + showIdeaId)
            .querySelector('.button-more-info')
        ) {
          //	document.querySelector('#idea-' + showIdeaId).querySelector('.button-more-info').click();
          $('#idea-' + showIdeaId)
            .find('.button-more-info')
            .click();
          setTimeout(function () {
            scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;
            $([document.documentElement, document.body]).stop().animate(
              {
                scrollTop: scrollToTop,
              },
              100
            );
          });
        }
      }
    }
  },
});

// For some strange reason, when a p tag is inside of a div and the div has a click listener, then the p tag will be the target node.
function onTagSelectboxClick(e) {
  const parent = e.target.parentNode;
  if (parent) {
    parent.classList.toggle('selected');
  }
}
