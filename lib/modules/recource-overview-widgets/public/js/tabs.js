// tab selector functions
var activeTab = getCookie('plannenActiveTab') || 0;
var activeFilter = getCookie('plannenActiveFilter') || 0;
(function() {
  activateIdeaOverviewTab(activeTab)
  activateIdeaOverviewFilter(activeFilter)
})();

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function activateIdeaOverviewTab(which) {
  activeTab = which;
  document.cookie = 'plannenActiveTab=' + activeTab + "; SameSite=Strict";

  var themaSelectorEl = document.getElementById('themaSelector');

  if (which > 0) {
    $(themaSelectorEl).addClass('active');
  } else {
    $(themaSelectorEl).removeClass('active');
  }


  if (themaSelectorEl) {
    themaSelectorEl.selectedIndex = activeTab;
    if (themaSelectorEl.selectedIndex === 0) {
      themaSelectorEl.options[0].innerHTML = 'Filter op thema';
    } else {
      themaSelectorEl.options[0].innerHTML = 'Alle thema\'s';
    }
  }

  updateIdeaOverviewDisplay();

  $(document).trigger('sortIdeas');
}

function activateIdeaOverviewFilter(which) {
  activeFilter = which;
  document.cookie = 'plannenActiveFilter=' + activeFilter + "; SameSite=Strict";

  var filterSelectorEl = document.getElementById('filterSelector');

  if (which > 0) {
    $(filterSelectorEl).addClass('active');
  } else {
    $(filterSelectorEl).removeClass('active');
  }

  if (filterSelectorEl) {
    filterSelectorEl.selectedIndex = activeFilter;
    if (filterSelectorEl.selectedIndex === 0) {
      filterSelectorEl.options[0].innerHTML = 'Filter op gebied';
    } else {
      filterSelectorEl.options[0].innerHTML = 'Alle gebieden';
    }
  }

  updateIdeaOverviewDisplay();

  $(document).trigger('sortIdeas');
}

function deactivateIdeaOverviewAll() {
  activateIdeaOverviewTab(0)
  activateIdeaOverviewFilter(0)
}

function updateIdeaOverviewDisplay() {
  var activeTab = document.getElementById('themaSelector');
  var activeFilter = document.getElementById('filterSelector');

  var activeThema = activeTab ? activeTab.value : '';
  var activeGebied = activeFilter ? activeFilter.value : '';

  var elements = document.getElementsByClassName('idea-item');

  $(document).trigger('updateIdeaOverviewDisplay');

  Array.prototype.forEach.call(elements, function(element) {

    var elementThema = element.querySelector('.thema') && element.querySelector('.thema').innerHTML;
    var elementGebied = element.querySelector('.gebied') && element.querySelector('.gebied').innerHTML;


    if (!elementThema ) {
      element.style.display = 'inline-block';
    }

    if (
      // no activeTab selected or
      (( !activeThema || activeThema == 0 ) || activeThema === elementThema)
      &&
      // active Filter selected
      (( !activeGebied || activeGebied == 0 ) || activeGebied === elementGebied)
    ) {
      element.style.display = 'inline-block';
    } else {
      element.style.display = 'none';
    }
  });

}
