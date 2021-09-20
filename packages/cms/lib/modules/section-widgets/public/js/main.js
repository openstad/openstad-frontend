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

  console.log('$tabContainers', $tabContainers)

  if ($tabContainers.length > 0) {
    $tabContainers.hide();

    $(window).on( 'hashchange', function( e ) {
      setContainerForHash()
    });

    if (!window.location.hash || window.location.hash.length === 0) {
      $parent.find('.tab-link').first().get(0).click();
    } else {
      setContainerForHash();
    }
  }
}


function setContainerForHash() {
  var hash = window.location.hash;
  console.log('hash', hash);

  if (hash.startsWith('#tab-')) {
    $('.tab-container').hide();
    $(window.location.hash).show();
  }
}