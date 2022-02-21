apos.define('section-widgets', {
  extend:    'apostrophe-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {
      initTabs($widget);
    }
  }
});


function initTabs ($parent) {
  var $tabContainers = $parent.find('.tab-container');


  if ($tabContainers.length > 0) {
    $tabContainers.hide();

    $(window).on( 'hashchange', function( e ) {
      setContainerForHash($parent)
    });

    if (!window.location.hash || window.location.hash.length === 0) {
      $parent.find('.nav-link').first().get(0).click();
    } else {
      setContainerForHash($parent);
    }
  }
}


function setContainerForHash($parent) {
  var hash = window.location.hash;

  if (hash.startsWith('#tab-')) {
    $parent.find('.tab-container').hide();
    $parent.find('.nav-link').removeClass('active')
    var selector = 'a[href*="'+hash+'"]';
    // console.log('selector', selector, $parent.find(selector))
    $parent.find(selector).addClass('active')
    $(hash).show();
  }
}
