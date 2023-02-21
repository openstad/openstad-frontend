apos.define('section-widgets', {
  extend:    'apostrophe-widgets',
  construct: function (self, options) {
    self.play = function ($widget, data, options) {
      initTabs($widget);
    }
  }
});

function findMyHash($parent) {

  var hashes = window.location.hash && window.location.hash.match(/#tab-\d+(?:-[^#]+)?/g);

  for (var i = 0; i < hashes.length; i++) {
    var hash = hashes[i];
    var match = hash.match(/#tab-(\d+)(?:-([^#]+))?/);
    if (match[2] && $parent.find('.section-tabs-'+match[2]).length) return hash;
  }

  for (var i = 0; i < hashes.length; i++) {
    var hash = hashes[i];
    var match = hash.match(/#tab-(\d+)(?:-([^#]+))?/);
    if (!match[2]) return hash;
  }

}

function initTabs ($parent) {

  var $tabContainers = $parent.find('.tab-container');

  if ($tabContainers.length > 0) {
    $tabContainers.hide();

    $(window).on('hashchange', function( e ) {
      var hash = findMyHash($parent);
      if (hash) setContainerForHash($parent, hash)
    });

    var hash = findMyHash($parent);
    if (!hash) {
      $parent.find('.nav-link').first().get(0).click();
    } else {
      setContainerForHash($parent, hash);
    }
  }
}

function setContainerForHash($parent, hash) {
  var match = hash.match(/#tab-(\d+)(?:-([^#]+))?/);
  var tabnumber = match[1];
  var sectionName = match[1][2] || $parent[0].innerHTML.match(/class="section-tabs section-tabs-([^"]*)"/)[1];
  hash = '#tab-' + tabnumber + (sectionName ? '-'+sectionName: '');
  $parent.find('.tab-container').hide();
  $parent.find('.nav-link').removeClass('active')
  var selector = 'a[href*="'+'#tab-'+tabnumber+'-'+sectionName+'"]';
  $parent.find(selector).addClass('active')
  $parent.find('#tab-'+tabnumber+'-container').show();
}
