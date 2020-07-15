// tab selector functions
function openstadGup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

function setGetParam(key,value) {
  if (history.pushState && typeof URLSearchParams !== "undefined") {
    var params = new URLSearchParams(window.location.search);
    params.set(key, value);
    var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params.toString();
    window.history.pushState({path:newUrl},'',newUrl);
  }
}

/*
// tab selector functions
var activeTab = getCookie('plannenActiveTab') || 0;
var activeFilter = getCookie('plannenActiveFilter') || 0;

//get from url the selected index
activeTab = openstadGup('theme') || activeTab;
activeFilter = openstadGup('area') || activeFilter;
*/

var activeTab = openstadGup('theme') || 0;
var activeFilter = openstadGup('area') || 0;


(function() {
  if (activeTab > 0) {
    activateIdeaOverviewTab(activeTab);
  }
  if (activeFilter > 0) {
    activateIdeaOverviewFilter(activeFilter);
  }
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

  if (themaSelectorEl) {
    setGetParam('theme', activeTab);
  }

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

  if (filterSelectorEl) {
    setGetParam('area', activeFilter);
  }
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
