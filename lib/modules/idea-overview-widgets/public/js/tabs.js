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
  document.getElementById('themaSelector' + activeTab).className = document.getElementById('themaSelector' + activeTab).className.replace(/ ?active/, '');
  activeTab = which;
  document.cookie = 'plannenActiveTab=' + activeTab;
  document.getElementById('themaSelector' + activeTab).className += ' active';
  updateDisplay();
}

function activateFilter(which) {
  activeFilter = which;
  document.cookie = 'plannenActiveFilter=' + activeFilter;
  document.getElementById('filterSelector').selectedIndex = activeFilter;
  if (document.getElementById('filterSelector').selectedIndex == '0') {
    document.getElementById('filterSelector').options[0].innerHTML = 'Filter op gebied';
  } else {
    document.getElementById('filterSelector').options[0].innerHTML = 'Alle gebieden';
  }
  updateDisplay();
}

function deactivateAll() {
  activateTab(0)
  activateFilter(0)
}

function updateDisplay() {
  var activeThema = document.getElementById('themaSelector' + activeTab).innerHTML;
  var activeGebied = document.getElementById('filterSelector').value;

  let elements = document.getElementsByClassName('tile');
  Array.prototype.forEach.call(elements, function(element) {
    var elementThema = element.querySelector('.thema') && element.querySelector('.thema').innerHTML;
    var elementGebied = element.querySelector('.gebied') && element.querySelector('.gebied').innerHTML;
    if ((( !activeTab || activeTab == 0 ) || activeThema == elementThema) && (( !activeFilter || activeFilter == 0 ) || activeGebied == elementGebied)) {
      element.style.display = 'inline-block';
    } else {
      element.style.display = 'none';
    }
  });

}
