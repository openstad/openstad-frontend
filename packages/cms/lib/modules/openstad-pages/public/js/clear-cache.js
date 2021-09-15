$(document).ready(function () {
  if (apos && apos.adminBar) {
    apos.adminBar.link('openstad-clear-cache', function() {
      window.location.replace(window.siteUrl + "/clear-cache");
    });
  }
})
