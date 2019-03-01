// ----------------------------------------------------------------------------------------------------
// budgeting functions

// stap 1: kies plannen
// stap 2: overzicht van je gekozen plannen
// stap 3: vul je stemcode in, met knop naar mijnopenstad
// stap 4: resultaat van het invullen van je stemcode
// stap 5: stem nu, met knop
// stap 6: resultaat van het stemmen; logt je ook direct uit
// stap 7: doorverwijzing naar /begroten, dwz. begin opnieuw

// config
var initialAvailableBudget = 300000;
var minimalBudgetSpent = 200000;

// vars
var availableBudgetAmount = initialAvailableBudget;
var currentBudgetSelection = openstadGetStorage('currentBudgetSelection') || [];

var currentStep = 1;

function toggleIdeaInBudget(id) {
	var index = currentBudgetSelection.indexOf(id);
	if (index == -1) {
		addIdeaToBudget(id);
	} else {
		removeIdeaFromBudget(id);
	}
}

function addIdeaToBudget(id) {

	var element = sortedElements.find( function(el) { return el.ideaId == id } );

	if (availableBudgetAmount >= element.budgetValue && currentBudgetSelection.indexOf(id) == -1) {
		currentBudgetSelection.push(id);
	}
	recalculateAvailableBudgetAmount();

	openstadSetStorage('currentBudgetSelection', currentBudgetSelection)

	document.querySelector('#budgeting-edit-mode').checked = false;
	addToClassName(document.querySelector('#budgeting-edit-mode-container'), 'hidden');

	updateBudgetDisplay();
	updateListElements();

}

function removeIdeaFromBudget(id) {

	var element = sortedElements.find( function(el) { return el.ideaId == id } );
	var index = currentBudgetSelection.indexOf(id);

	currentBudgetSelection.splice(index, 1);
	recalculateAvailableBudgetAmount();

	openstadSetStorage('currentBudgetSelection', currentBudgetSelection)

	// scrollToBudget()

	updateBudgetDisplay();
	updateListElements();

}

function recalculateAvailableBudgetAmount() {
	availableBudgetAmount = initialAvailableBudget;
	currentBudgetSelection.forEach( function(id) {
		var element = sortedElements.find( function(el) { return el.ideaId == id } );
		availableBudgetAmount -= element.budgetValue;
	});
}

var budgetingEditMode;

function setBudgetingEditMode() {

	var preview = document.querySelector('#current-budget-preview');
	var isChecked = document.querySelector('#budgeting-edit-mode').checked;

	if (isChecked) {
		addToClassName(preview, 'editMode');
		var images = preview.querySelectorAll('.idea-image-mask');
		for (var i=0; i<images.length; i++) {
			var image = images[i];
			$(image).on('click', function () {
				var ideaId = parseInt($(this).attr('data-idea-id'), 10);
				removeIdeaFromBudget(ideaId)
			});
		}
	} else {
		removeFromClassName(preview, 'editMode');
		var images = preview.querySelectorAll('.idea-image-mask');
		for (var i=0; i<images.length; i++) {
			var image = images[i];
			var ideaId = image.ideaId;
			image.onclick = ''; // function(e) { document.querySelector('#idea-'+this.ideaId).click() };
		}
	}

}


function previousStep() {
	scrollToBudget()
	currentStep--;

	if (currentStep == 3) {
		if (typeof userIsLoggedIn != 'undefined' && userIsLoggedIn &&!userHasVoted ) {
			// user is al ingelogd
			currentStep = 2;
		}
	}

	updateBudgetDisplay();
}

function nextStep() {

	scrollToBudget()

	if (currentStep == 1) {
		if (initialAvailableBudget - availableBudgetAmount < minimalBudgetSpent) {
			addError(document.querySelector('#current-budget-preview'), initialAvailableBudget - availableBudgetAmount == 0 ? 'Je hebt nog geen plannen geselecteerd.' : 'Je hebt nog niet voor € 200.000 aan plannen geselecteerd.')
			return;
		}
	}

	if (currentStep == 3) {
		// in stap 3 doet de knop niets
		addToClassName(document.querySelector('.button-stemcode.vul-je-stemcode-in'), 'do-this-first');
		return;
	}

	currentStep++;

	if (currentStep == 3) {
		if (typeof userIsLoggedIn != 'undefined' && userIsLoggedIn &&!userHasVoted ) {
			// user is al ingelogd en kan gaan stemmen
			currentStep = 4;
		}
	}

	updateBudgetDisplay();

	if (currentStep == 5) {
		submitBudget();
	}

	if (currentStep == 6) {
		// setTimeout(nextStep, 10000);
	}

	if (currentStep == 7) {
		window.location.href = authServerLogoutUrl ? authServerLogoutUrl : '/begroten';
	}

}

function updateBudgetDisplay() {

	// stappen balk
	removeFromClassName(document.querySelector('#steps-bar-1'), 'active')
	removeFromClassName(document.querySelector('#steps-bar-2'), 'active')
	removeFromClassName(document.querySelector('#steps-bar-3'), 'active')
	removeFromClassName(document.querySelector('#steps-bar-4'), 'active')
	removeFromClassName(document.querySelector('#steps-bar-1'), 'passed');
	removeFromClassName(document.querySelector('#steps-bar-2'), 'passed');
	removeFromClassName(document.querySelector('#steps-bar-3'), 'passed');
	removeFromClassName(document.querySelector('#steps-bar-4'), 'passed');


	// botte bijl - later een keer opschonen en generiek maken
	// ToDo: wat nu gecopy-paste dingen samenvoegen
	removeError(document.querySelector('#current-budget-preview'));

	var budgetBar = document.querySelector('#current-budget-bar').querySelector('.current-budget-images');
	var preview = document.querySelector('#current-budget-preview');
	var previewImages = document.querySelector('#current-budget-preview').querySelector('.current-budget-images');
	var previewTable = document.querySelector('#current-budget-preview').querySelector('.current-budget-table');

	// always update the budget bar
	var borderWidth = 3;
	var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging
	var minwidth = isPhone ? 10 : 20;
	var totalWidth = document.querySelector('#current-budget-bar').offsetWidth - 1 * borderWidth;
	var availableWidth = document.querySelector('#current-budget-bar').offsetWidth - 1 * borderWidth;
	var usedWidth = 0;
	var currentBudgetSelectionForWidth = currentBudgetSelection.map( function(id) { return sortedElements.find( function(el) { return el.ideaId == id } ); } )
	currentBudgetSelectionForWidth
		.sort(function (a, b) {
			return a.budgetValue - b.budgetValue;
		})
		.forEach( function(element) {
			var width =  parseInt(availableWidth * ( element.budgetValue / initialAvailableBudget ));
			if (width < minwidth) {
				availableWidth = availableWidth - ( minwidth - width );
				width = minwidth
			}
			usedWidth += width;
			element.budgetBarWidth = width;
		})
	if (availableBudgetAmount == 0) {
		if (usedWidth > totalWidth ) {
			currentBudgetSelectionForWidth.budgetBarWidth -= usedWidth - totalWidth ;
		}
		if (usedWidth < totalWidth ) {
			currentBudgetSelectionForWidth[currentBudgetSelectionForWidth.length-1].budgetBarWidth += totalWidth - usedWidth;
		}
	}

	while(budgetBar.hasChildNodes()) {
		budgetBar.removeChild(budgetBar.childNodes[0])
	}

	currentBudgetSelection.forEach( function(id) {
		var element = sortedElements.find( function(el) { return el.ideaId == id } );
		var budgetBarImage = element.querySelector('.idea-image-mask').cloneNode(true);

		budgetBarImage.setAttribute('data-idea-id', id);
		budgetBarImage.className += ' idea-' + id;

		// todo: better width calculation
		budgetBarImage.style.width = element.budgetBarWidth + 'px';
		budgetBarImage.ideaId = element.ideaId; // used by onclick
		// budgetBarImage.onclick = function(e) { document.querySelector('#idea-'+this.ideaId).click() };
		budgetBar.appendChild(budgetBarImage)
	});

	var addButton = document.querySelector('#steps-content-1').querySelector('.add-button');
	previewImages.appendChild( addButton.cloneNode(true) )

	// text
	removeFromClassName(document.querySelector('#current-step').querySelector('#text'), 'error-block');
	document.querySelector('#current-step').querySelector('#text').innerHTML = document.querySelector('#steps-content-' + currentStep).querySelector('.text').innerHTML;
	$('#current-step').removeClass().addClass('active-step-' + currentStep);

	switch(currentStep) {

		case 1:

			addToClassName(document.querySelector('#steps-bar-1'), 'active')
			removeFromClassName(document.querySelector('#ideasList'), 'hidden')

			removeFromClassName(previewImages, 'hidden');
			addToClassName(previewTable, 'hidden');

			$('.current-budget-amount').html(formatEuros(initialAvailableBudget - availableBudgetAmount));
		  $('.available-budget-amount').html(formatEuros(availableBudgetAmount));

			previewImages.innerHTML = '';
			currentBudgetSelection.forEach( function(id) {
				var element = sortedElements.find( function(el) { return el.ideaId == id } );
				var previewImage = element.querySelector('.idea-image-mask').cloneNode(true);
				previewImage.ideaId = element.ideaId; // used by setBudgetingEditMode
				previewImage.setAttribute('data-idea-id', element.ideaId);
				previewImage.className += ' idea-' + element.ideaId;


				var linkToIdea = document.createElement("a");
				linkToIdea.href = '#showidea-' + element.ideaId;
				linkToIdea.appendChild(previewImage);

				previewImages.appendChild(linkToIdea)
			});
			var addButton = document.querySelector('#steps-content-1').querySelector('.add-button');
			previewImages.appendChild( addButton.cloneNode(true) )

			if (currentBudgetSelection.length == 0) {
				document.querySelector('#budgeting-edit-mode').checked = false;
				addToClassName(document.querySelector('#budgeting-edit-mode-container'), 'hidden');
			} else {
				removeFromClassName(document.querySelector('#budgeting-edit-mode-container'), 'hidden');
			}
			setBudgetingEditMode()

			break;

		case 2:
			addToClassName(document.querySelector('#steps-bar-1'), 'passed')
			addToClassName(document.querySelector('#steps-bar-2'), 'active')
			addToClassName(document.querySelector('#ideasList'), 'hidden')

			$('.current-budget-amount').html(formatEuros(initialAvailableBudget - availableBudgetAmount));
			$('.available-budget-amount').html(formatEuros(availableBudgetAmount));

			addToClassName(previewImages, 'hidden');
			removeFromClassName(previewTable, 'hidden');
			addToClassName(document.querySelector('#budgeting-edit-mode-container'), 'hidden');

			var overview = previewTable.querySelector('.overview');
			var $overviewContainer = $(previewTable).find('.overview');

			overview.innerHTML = '';

			var overviewHtml = ''

			currentBudgetSelection.forEach(function(id) {
				var element = sortedElements.find( function(el) { return el.ideaId == id } );
				var imageEl = element.querySelector('.idea-image-mask').cloneNode(true);//.innerHTML;
				var titleEl = element.querySelector('.title').cloneNode(true).innerHTML;
				var budgetEl = element.querySelector('.budget').cloneNode(true).innerHTML;

				imageEl.setAttribute('data-idea-id', id);
				imageEl.className += ' idea-' + id;
				imageEl = imageEl.innerHTML;


				overviewHtml = overviewHtml + '<tr><td>'+imageEl + '</td><td>'+ titleEl +'</td><td class="text-align-right primary-color">' +budgetEl+ '</td></tr>';
			});

			overviewHtml = overviewHtml + '<tr class="line stretch"><td  colspan="3" ><hr /></td></tr>';
			overviewHtml = overviewHtml + '<tr class="total-row primary-color"><td colspan="3"><div style="float:left;">Totaal gebruikt budget</div> <div style="float:right;">'+formatEuros(initialAvailableBudget - availableBudgetAmount, true)+'</div></td></tr>';
			$overviewContainer.append('<table cellpadding="0" class="table-center stretch">' + overviewHtml + '</table>');
			$overviewContainer.append('<hr class="fully"/>');
			$overviewContainer.append('<div class="row bold leftovers"><div class="col-xs-6">Ongebruikt budget:</div><div class="col-xs-6 align-right">'+formatEuros(availableBudgetAmount, true)+'</div></div>');

			break;

		case 3:
			addToClassName(document.querySelector('#steps-bar-1'), 'passed')
			addToClassName(document.querySelector('#steps-bar-2'), 'passed')
			addToClassName(document.querySelector('#steps-bar-3'), 'active')
			addToClassName(document.querySelector('#ideasList'), 'hidden')

			$('.current-budget-amount').html(formatEuros(initialAvailableBudget - availableBudgetAmount));
			$('.available-budget-amount').html(formatEuros(availableBudgetAmount));

			addToClassName(previewImages, 'hidden');
			addToClassName(previewTable, 'hidden');

			if (userHasVoted) {
				removeFromClassName(document.querySelector('.error-block'), 'hidden');
			} else {
				addToClassName(document.querySelector('.error-block'), 'hidden');
			}

			break;


		case 4:
			addToClassName(document.querySelector('#steps-bar-1'), 'passed')
			addToClassName(document.querySelector('#steps-bar-2'), 'passed')
			addToClassName(document.querySelector('#steps-bar-3'), 'active')
			addToClassName(document.querySelector('#ideasList'), 'hidden')

			$('.current-budget-amount').html(formatEuros(initialAvailableBudget - availableBudgetAmount));
			$('.available-budget-amount').html(formatEuros(availableBudgetAmount));

			addToClassName(previewImages, 'hidden');
			addToClassName(previewTable, 'hidden');

			break;

		case 5:
			addToClassName(document.querySelector('#steps-bar-1'), 'passed')
			addToClassName(document.querySelector('#steps-bar-2'), 'passed')
			addToClassName(document.querySelector('#steps-bar-3'), 'passed')
			addToClassName(document.querySelector('#steps-bar-4'), 'active')
			addToClassName(document.querySelector('#ideasList'), 'hidden')

			break;

		case 6:
			addToClassName(document.querySelector('#steps-bar-1'), 'passed')
			addToClassName(document.querySelector('#steps-bar-2'), 'passed')
			addToClassName(document.querySelector('#steps-bar-3'), 'passed')
			addToClassName(document.querySelector('#steps-bar-4'), 'active')
			addToClassName(document.querySelector('#ideasList'), 'hidden')
			break;


	}

	updateBudgetNextButton();

}

function updateBudgetNextButton(isError) {

	var previousButton = document.querySelector('#previous-button');
	var nextButton = document.querySelector('#next-button');

	if (isError) {
		removeFromClassName(previousButton, 'hidden');
		addToClassName(nextButton, 'hidden');
		return;
	}

	switch(currentStep) {

		case 1:
			addToClassName(previousButton, 'hidden');
			nextButton.innerHTML = 'Volgende';
			if (initialAvailableBudget - availableBudgetAmount >= minimalBudgetSpent) {
				addToClassName(nextButton, 'active')
			} else {
				removeFromClassName(nextButton, 'active')
			}
			break;

		case 2:
			nextButton.innerHTML = 'Volgende';
			removeFromClassName(previousButton, 'hidden');
			removeFromClassName(nextButton, 'hidden');

			if (initialAvailableBudget - availableBudgetAmount >= minimalBudgetSpent) {
				addToClassName(nextButton, 'active')
			} else {
				removeFromClassName(nextButton, 'active')
			}

			break;

		case 3:
			nextButton.innerHTML = 'Stemmen';
			removeFromClassName(previousButton, 'hidden');
			removeFromClassName(nextButton, 'hidden');
			removeFromClassName(nextButton, 'active')
			break;

		case 4:
			nextButton.innerHTML = 'Stemmen';
			removeFromClassName(previousButton, 'hidden');
			removeFromClassName(nextButton, 'hidden');
			addToClassName(nextButton, 'active');

		case 5:
			break;

		case 6:
			nextButton.innerHTML = 'Klaar';
			addToClassName(previousButton, 'hidden');
			removeFromClassName(nextButton, 'hidden');
			addToClassName(nextButton, 'active');

	}

}

function login() {

	logout({
		success: function(data) {
			window.location.href = '/oauth/login?redirect_uri=/begroten'
		},
		error: function(error) {
			window.location.href = '/oauth/login?redirect_uri=/begroten'
		}
	});

}


function logout(options) {

	$.ajax({
		url: '/oauth/logout',
		dataType: "json",
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		beforeSend: function(request) {
			request.setRequestHeader("Content-type", "application/json");
			request.setRequestHeader("Accept", "application/json");
		},
		success: function(data) {
			console.log('=1');
			logoutMijnOpenstad(options);
		},
		error: function(error) {
			console.log('Request failed', error);
			// ignore response - TODO dus
			console.log('=2');
			logoutMijnOpenstad(options);
		}
	});

	function logoutMijnOpenstad(options) {
		$.ajax({
			url: authServerLogoutUrl,
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			beforeSend: function(request) {
				request.setRequestHeader("Content-type", "application/json");
				request.setRequestHeader("Accept", "application/json");
			},
			success: options.sucess,
			error: options.error,
		});

	}

}

function submitBudget() {

	removeFromClassName(document.querySelector('#waitLayer'), 'hidden');

	if (!userIsLoggedIn) {
		addToClassName(document.querySelector('#waitLayer'), 'hidden');
		currentStep = 4;
		updateBudgetDisplay();
		return;
	}

	let data = {
		budgetVote: currentBudgetSelection,
		_csrf: csrfToken,
	}


	let url = '/api/site/15/budgeting';

	$.ajax({
    url: url,
		type: 'post',
		dataType: 'json',
		data: data,
    success: function(data) {
			// na het stemmen bewaren we niets meer
			currentBudgetSelection = [];
			openstadRemoveStorage('currentBudgetSelection');
			openstadRemoveStorage('hide-info-bewoners-west');
			openstadRemoveStorage('lastSorted');
			openstadRemoveStorage('plannenActiveTab');
			openstadRemoveStorage('plannenActiveFilter');
			openstadRemoveStorage('sortOrder');
			availableBudgetAmount = initialAvailableBudget;
			addToClassName(document.querySelector('#waitLayer'), 'hidden');

			logout({
				success: function(data) {
					nextStep();
				},
				error: function(error) {
					console.log('Request failed', error);
					// ignore response - TODO dus
					nextStep();
				}
			});

    },
    error: function(error) {
			addToClassName(document.querySelector('#waitLayer'), 'hidden');
			console.log('Request failed', error);
			var message = 'Het opslaan van je stem is niet gelukt: ' + ( error && error.responseJSON && error.responseJSON.message ? error.responseJSON.message : error );
			if (error && typeof error.status != 'undefined' && ( error.status == 0 || error.status == 502 ) ) message = 'Er is iets mis gegaan bij het opslaan van je stem.<br/>Klik op \'Vorige\' en probeer het nog eens.';
			showError(message)
    }
  });

	return;

}


// error on field
function addError(element, text) {
	addToClassName(element, 'error');
	element.setAttribute('data-error-content', text);
}

function removeError(element, text) {
	removeFromClassName(element, 'error');
	element.setAttribute('data-error-content', '');
}

// error in budgeting window
function showError(error) {
	var previewImages = document.querySelector('#current-budget-preview').querySelector('.current-budget-images');
	var previewTable = document.querySelector('#current-budget-preview').querySelector('.current-budget-table');
	addToClassName(previewImages, 'hidden');
	addToClassName(previewTable, 'hidden');
	document.querySelector('#current-step').querySelector('#text').innerHTML = error;
	addToClassName(document.querySelector('#current-step').querySelector('#text'), 'error-block');
	updateBudgetNextButton(true);
}

// end budgeting functions
// ----------------------------------------------------------------------------------------------------
// sort functions

var sortOrder = openstadGetStorage('sortOrder') || defaultSort;
var lastSorted = openstadGetStorage('lastSorted');

var sortedElements = [];

(function() {
	initSortedElements()
	document.querySelector('#selectSort').value = sortOrder;
	doSort(sortOrder)
})();

function initSortedElements() {

	var elements = document.querySelectorAll('.gridder-list');

	for (var i=0; i<elements.length; i++) {
		var element = elements[i];
		var id = element.id.match(/idea-(\d+)/)[1];
		element.ideaId = parseInt(id);
		element.budgetValue = parseInt( element.querySelector('.budget-value').innerHTML ); // easier to use later
		var budgets = element.querySelectorAll('.budget');
		for (var j=0; j<budgets.length; j++) {
			var el = budgets[j];
			el.innerHTML = formatEuros(el.innerHTML, true);
		}
		sortedElements.push(element);
	};

	if (lastSorted) {
		sortedElements = sortedElements.sort( function(a,b) { return lastSorted.indexOf(a.ideaId) - lastSorted.indexOf(b.ideaId) } );
	} else {
		lastSorted = [];
		sortedElements.forEach( function(element) {
			lastSorted.push(element.ideaId);
		});
		openstadSetStorage('lastSorted', lastSorted);
	}

	updateList();

}

function doSort(which) {

	sortOrder = which;
	openstadSetStorage('sortOrder', sortOrder);

	switch(sortOrder){
		case 'random':
			sortedElements = sortedElements.sort( function(a,b) { return lastSorted.indexOf(a.ideaId) - lastSorted.indexOf(b.ideaId) });
			break;
		case 'ranking':
			sortedElements = sortedElements.sort( function(a,b) { return a.querySelector('.ranking-value').innerHTML - b.querySelector('.ranking-value').innerHTML });
			break;
		case 'budget-up':
			sortedElements = sortedElements.sort( function(a,b) { return a.querySelector('.budget-value').innerHTML - b.querySelector('.budget-value').innerHTML });
			break;
		case 'budget-down':
			sortedElements = sortedElements.sort( function(a,b) { return b.querySelector('.budget-value').innerHTML - a.querySelector('.budget-value').innerHTML });
			break;
	}

	updateList();

}

// end sort functions
// ----------------------------------------------------------------------------------------------------
// tab selector functions

var activeTab = openstadGetStorage('plannenActiveTab') || 0;
var activeFilter = openstadGetStorage('plannenActiveFilter') || 0;

(function() {
	activateTab(activeTab)
	activateFilter(activeFilter)
})();

function activateTab(which) {
	gridderClose();
	removeFromClassName(document.getElementById('themaSelector' + activeTab), 'active');
	activeTab = which;
	openstadSetStorage('plannenActiveTab', activeTab);
	addToClassName(document.getElementById('themaSelector' + activeTab), 'active');
	updateList();
}

function activateFilter(which) {
	gridderClose();
	activeFilter = which;
	openstadSetStorage('plannenActiveFilter', activeFilter);
	document.getElementById('filterSelector').selectedIndex = activeFilter;
	if (document.getElementById('filterSelector').selectedIndex == '0') {
		document.getElementById('filterSelector').options[0].innerHTML = 'Filter op gebied';
	} else {
		document.getElementById('filterSelector').options[0].innerHTML = 'Alle gebieden';
	}
	updateList();
}

function deactivateAll() {
	activateTab(0)
	activateFilter(0)
}

// end tab selector functions
// ----------------------------------------------------------------------------------------------------
// update list display functions

// update list after sort or tab selection
function updateList() {

	var activeThema = document.getElementById('themaSelector' + activeTab) ? document.getElementById('themaSelector' + activeTab).innerHTML : '';
	// if (activeThema == 'Groen') activeThema = 'Groen en Openbare ruimte';
	var activeGebied = document.getElementById('filterSelector').value ? document.getElementById('filterSelector').value : '';

	// show only the selected elements; display: none does not work well with gridder

	var list = document.querySelector('#ideaList');
	while(list.hasChildNodes()) {
		list.removeChild(list.childNodes[0])
	}

	//var newList = document.createElement('ul');

	sortedElements.forEach( function(element) {
		var elementThema = element.querySelector('.thema') && element.querySelector('.thema').innerHTML;
		var elementGebied = element.querySelector('.gebied') && element.querySelector('.gebied').innerHTML;
		if ((( !activeTab || activeTab == 0 ) || activeThema == elementThema) && (( !activeFilter || activeFilter == 0 ) || activeGebied == elementGebied)) {
			list.appendChild(element)
			//newList.appendChild(element)
		}
	});

  // document.querySelector('#ideaList').innerHTML = newList.innerHTML;

	updateListElements()

}

// update list elements after changes in budget
function updateListElements() {

	// update add and budget buttons in list
	sortedElements.forEach( function(element) {
		updateElement(element);
	});

	// update add and budget buttons in gridder-show
	var gridderShow = document.querySelector('.gridder-show');
	if (gridderShow) {
		gridderShow.ideaId = parseInt( gridderShow.querySelector('.this-idea-id').innerHTML );
		updateElement(gridderShow);
	};

	function updateElement(element) {
		// is added to the budgetting selection
		if (currentBudgetSelection.indexOf( element.ideaId ) != -1) {
			var elements = element.querySelectorAll('.button-add-idea-to-budget');
			for (var i=0; i<elements.length; i++) {
				var el = elements[i];
				addToClassName(el, 'added');
			}
		} else {
			var elements = element.querySelectorAll('.button-add-idea-to-budget');
			for (var i=0; i<elements.length; i++) {
				var el = elements[i];
				removeFromClassName(el, 'added');
			}

			// is available, i.e. amount is smaller than the available budget
			if (element.budgetValue > availableBudgetAmount) {
				var elements = element.querySelectorAll('.budget');
				for (var i=0; i<elements.length; i++) {
					var el = elements[i];
					addToClassName(el, 'unavailable');
				}
				var elements = element.querySelectorAll('.button-add-idea-to-budget');
				for (var i=0; i<elements.length; i++) {
					var el = elements[i];
					addToClassName(el, 'unavailable');
				}
			} else {
				var elements = element.querySelectorAll('.budget');
				for (var i=0; i<elements.length; i++) {
					var el = elements[i];
					removeFromClassName(el, 'unavailable');
				}
				var elements = element.querySelectorAll('.button-add-idea-to-budget');
				for (var i=0; i<elements.length; i++) {
					var el = elements[i];
					removeFromClassName(el, 'unavailable');
				}
			}
		}
	}

}

// end update list display functions
// ----------------------------------------------------------------------------------------------------
// gridder / list functions

function handleClick(event) {

	// search for the element clicked
	var target = event.target;
	var ideaElement;
	var buttonReadMore;
	var buttonAddIdeaToBudget;

	while ( target.tagName != 'HTML' ) {
		if ( target.className.match('gridder-list') ) {
			ideaElement = target;
			break;
		}
		if ( target.className.match(/button-add-idea-to-budget/) ) {
			buttonAddIdeaToBudget = target;
		}
		if ( target.className.match('button-read-more') ) {
			buttonReadMore = target;
		}
		target = target.parentNode || target.parentElement;
	}

	if (ideaElement) {

		// if button == 'add to budget'
		if (buttonAddIdeaToBudget) {
			var ideaId = ideaElement.ideaId;
			if (ideaId) {
				toggleIdeaInBudget(ideaId)
			}

			// cancel gridder
			event.stopPropagation()
			event.stopImmediatePropagation()
		}


	}

	document.querySelector('#budgeting-edit-mode').checked = false;
	// addToClassName(document.querySelector('#budgeting-edit-mode-container'), 'hidden');
	setBudgetingEditMode()

}

function gridderClose() {
	var element = document.querySelector('.gridder-close');
	if (element) {
		element.click();
	}
}

window.onload = function() { // using (function {} {})() happens too early
	displayIdeaOnHash();
};

$(window).on('hashchange', function() {
//	displayIdeaOnHash();
});


$(document).on('click', '.current-budget-images a', function (ev) {
	setTimeout(function() {
		displayIdeaOnHash();
}, 1)
});

function displayIdeaOnHash () {
	var showIdeaId;
	var match = window.location.search.match(/showIdea=(\d+)/);
	if (match) {
		showIdeaId = match[1];
	};
	var match = window.location.hash.match(/showidea-(\d+)/);
	if (match) {
		showIdeaId = match[1];
	};

	var isOpen =  $('#idea-' + showIdeaId).hasClass('selectedItem');
	var scrollToTop;
	var stickyHeight = $(window).width() > 767 ? 76 : 109;

	if (isOpen) {
		scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;

		$([document.documentElement, document.body]).animate({
        scrollTop: scrollToTop
    }, 200);
	} else {
		if (showIdeaId && document.querySelector('#idea-' + showIdeaId) && document.querySelector('#idea-' + showIdeaId).querySelector('.button-read-more')) {
			document.querySelector('#idea-' + showIdeaId).querySelector('.button-read-more').click();



			setTimeout(function() {
				scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;
				console.log('----> scrollToTop', scrollToTop);

				$([document.documentElement, document.body]).stop().animate({
						scrollTop: scrollToTop
				}, 100);

			})

		}


	}
//	return false;
}

function toggleImageLocation(id) {
	var element = document.querySelector('.gridder-expanded-content').querySelector('.image-location-toggable');
	console.log(id, element);
	if (element.className.match('show-location')) {
		removeFromClassName(element, 'show-location');
	} else {
		addToClassName(element, 'show-location');
	}
	console.log(element.className);
}

// end gridder / list functions
// ----------------------------------------------------------------------------------------------------
// infoblock

function showInfoBewonersWest() {
	document.querySelector('#info-bewoners-west').style.display = 'block';
}

function hideInfoBewonersWest() {
	document.querySelector('#info-bewoners-west').style.display = 'none';
	openstadSetStorage('hide-info-bewoners-west', true);
}

(function() {
	if (!openstadGetStorage('hide-info-bewoners-west')) {
		showInfoBewonersWest();
	}
})();

// end infoblock
// ----------------------------------------------------------------------------------------------------
// other

function addToClassName(element, className) {
	if (element) {
		if (!element.className.match(new RegExp(' ?' + className + '(?: |$)' ))) {
			element.className += ' ' + className;
		}
	}
}

function removeFromClassName(element, className) {
	// if (element) {
		element.className = element.className.replace(new RegExp(' ?' + className + '(?: |$)' ), '');
	// }
}

function formatEuros(amount, html) {
	// todo: nu hardcoded want max 300K
	amount = parseInt(amount);
	let thousends = parseInt(amount/1000);
	let rest = ( amount - 1000 * thousends ).toString();
	if (rest.length < 3) rest = '0' + rest;
	if (rest.length < 3) rest = '0' + rest;

	if (thousends) {
		thousends = thousends + '.'
	} else {
		thousends = '';
		if ( rest == '000' ) {
			rest = 0
		}
	}

	return html ? '<span class="eurosign">€ </span><span class="amount">' + thousends + rest + '</span>' : '€ ' +  thousends + rest;
}

function scrollToIdeas() {
  scrollToResolver(document.querySelector('.tab-selector'));
}

function scrollToBudget() {
  scrollToResolver(document.querySelector('#main-budget-block'));
}

function scrollToResolver(elem) {
  var jump = parseInt(elem.getBoundingClientRect().top * .2);
  document.body.scrollTop += jump;
  document.documentElement.scrollTop += jump;
  if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
    elem.lastjump = Math.abs(jump);
    setTimeout(function() { scrollToResolver(elem);}, 25);
  } else {
    elem.lastjump = null;
  }
}

 function openstadSetStorage(name, value) {

	 if ( typeof name != 'string' ) return;

	 if ( typeof value == 'undefined' ) value = "";
	 if ( typeof value == 'object' ) {
		 try {
			 value = JSON.stringify(value);
		 } catch(err) {}
	 };

	 sessionStorage.setItem( name, value );

 }

 function openstadGetStorage(name) {

	 var value = sessionStorage.getItem(name);

	 try {
		 value = JSON.parse(value);
	 } catch(err) {}

	 return value;

 }

 function openstadRemoveStorage(name) {
   sessionStorage.removeItem(name)
 }


// end other
// ----------------------------------------------------------------------------------------------------
// polyfill

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

// end polyfill
// ----------------------------------------------------------------------------------------------------
// init

recalculateAvailableBudgetAmount();

if (initialAvailableBudget - availableBudgetAmount > minimalBudgetSpent) {
	if (typeof userIsLoggedIn != 'undefined' && userIsLoggedIn ) {
		if (userHasVoted) {
			currentStep = 3;
		} else {
			currentStep = 4;
		}
	}
}


updateBudgetDisplay();

// dev
// if (currentBudgetSelection.length == 0) {
//  	addIdeaToBudget(17)
//  	addIdeaToBudget(31)
//  	addIdeaToBudget(30)
// }

// end init
// ----------------------------------------------------------------------------------------------------
// TAF
