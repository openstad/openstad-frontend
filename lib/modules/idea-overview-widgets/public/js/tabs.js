// tab selector functions
var activeTab = getCookie('plannenActiveTab') || 0;
var activeFilter = getCookie('plannenActiveFilter') || 0;
(function() {
  activateTab(activeTab)
  activateFilter(activeFilter)
})();

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function activateTab(which) {
  var activeTabEl = document.getElementById('themaSelector' + activeTab);
  if (activeTabEl) {
    activeTabEl.className = document.getElementById('themaSelector' + activeTab).className.replace(/ ?active/, '');
    activeTabEl.className += ' active';
  }

  activeTab = which;
  document.cookie = 'plannenActiveTab=' + activeTab;
  updateDisplay();
}

function activateFilter(which) {
  activeFilter = which;
  document.cookie = 'plannenActiveFilter=' + activeFilter;

  var filterSelectorEl = document.getElementById('filterSelector');

  if (filterSelectorEl) {
    filterSelectorEl.selectedIndex = activeFilter;
    if (filterSelectorEl.selectedIndex == '0') {
      filterSelectorEl.options[0].innerHTML = 'Filter op gebied';
    } else {
      filterSelectorEl.options[0].innerHTML = 'Alle gebieden';
    }
  }

  updateDisplay();
}

function deactivateAll() {
  activateTab(0)
  activateFilter(0)
}

function updateDisplay() {
  var activeTab = document.getElementById('themaSelector' + activeTab);
  var activeFilter = document.getElementById('filterSelector');
  var activeThema = activeTab ? activeTab.innerHTML : '';
  var activeGebied = activeFilter ? activeFilter.value : '';

  let elements = document.getElementsByClassName('tile');
  Array.prototype.forEach.call(elements, function(element) {
    var elementThema = element.querySelector('.thema') && element.querySelector('.thema').innerHTML;
    var elementGebied = element.querySelector('.gebied') && element.querySelector('.gebied').innerHTML;

    console.log('elementThema', elementThema):
    if (!elementThema) {
      console.log('elementThema ins', elementThema):
      element.style.display = 'inline-block';

    }

    if ((( !activeTab || activeTab == 0 ) || activeThema == elementThema) && (( !activeFilter || activeFilter == 0 ) || activeGebied == elementGebied)) {
      element.style.display = 'inline-block';
    } else {
        element.style.display = 'none';
    }
  });

}
