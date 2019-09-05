// Sorting dropdown
// ----------------
//
//
/*
(function() {
  var select = document.querySelector('.sort > select');
  if (select) {
    select.addEventListener('change', function() {
      // Replace current `sort=x` with new choice.
      var pathName = location.pathname;
      var search   = location.search.replace(/sort=[a-z_]+/i, '') || '?';
      location.href = pathName + search + 'sort=' + select.value + '#ideas';
    });
  }
})();
*/
/*
(function($) {
  var tiles = $('.ideasList .tile:not([data-poster-url=""])');

  loadTileImages();
  window.addEventListener('scroll', loadTileImages);
  window.addEventListener('resize', loadTileImages);

  // Checks the current scroll position, and loads all tile image that are in
  // the range 'top of the page' to '50% viewport height below the current viewport'.
    function loadTileImages() {
      // Throttle checking to once every 100 ms.
        var now = +new Date;
      if( now - this.last < 100 ) return;
      this.last = now;

      var viewHeight = window.innerHeight;
      var scrollTop  = 'pageYOffset' in window            ? window.pageYOffset :
                       document.documentElement.scrollTop ? document.documentElement.scrollTop :
                       document.body.scrollTop;
      var tile;
      for( var i = 0; tile = tiles[i]; i++ ) {
        // Load in all tile that are in view, or are 50% of the view height
        // below the fold.
          var tileTop       = offsetTop(tile) || 0;
        var isOrWasInView = tileTop < (scrollTop + viewHeight * 1.5);
        if( isOrWasInView ) {
          // Load actual image...
            var img = tile.querySelector('div.image');
          img.style.backgroundImage = 'url(\''+tile.getAttribute('data-poster-url')+'\')';
          // ... and remove tile from the checklist.
            tile.removeAttribute('data-poster-url');
          tiles.splice(i, 1);
          i--;
        }
      }
    }

  // Element's vertical position, measured from the top of the page.
    function offsetTop( el, top ) {
      top = (top || 0) + el.offsetTop;
      return el && el.offsetParent && el.offsetParent != document.body ?
             offsetTop(el.offsetParent, top) :
             top;
    }
})(jQuery);
*/
