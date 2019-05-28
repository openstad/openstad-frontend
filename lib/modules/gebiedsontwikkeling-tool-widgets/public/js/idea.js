
function showIdeaDetails() {

	var infoblock = document.querySelector('#info-block')
	infoblock.innerHTML = document.querySelector('#idea-details').innerHTML;
	infoblock.querySelector('#description').innerHTML = currentIdea && currentIdea.description;
	infoblock.querySelector('#categorie').innerHTML = currentIdea && currentIdea.extraData && currentIdea.extraData.categorie;
	infoblock.querySelector('#type').innerHTML = ( currentIdea && currentIdea.extraData && currentIdea.extraData.type ) || 'n.v.t.';
	var time = currentIdea && currentIdea.extraData && currentIdea.extraData.time;
	var html = '';
	if (time) {
		if (time.weekday && time.weekday.length) {
			html += joinStrings(time.weekday) + '<br/>';
		}
		if (time.daypart && time.daypart.length) {
			html += joinStrings(time.daypart) + '<br/>';
		}
		if (time.timeofday) {
			html += time.timeofday + '<br/>';
		}
		infoblock.querySelector('#time').innerHTML = html;
		infoblock.querySelector('.right').style.display = 'block';
	}
	if (!time || !html) {
		infoblock.querySelector('.right').style.display = 'none';
	}

	infoblock.querySelector('#username').innerHTML = currentIdea && currentIdea.user && ( ( currentIdea.user.firstName || '' ) + ' ' + ( currentIdea.user.lastName || '' ) );
	infoblock.querySelector('#date').innerHTML = currentIdea  && currentIdea.startDateHumanized;

	if ( currentIdea.address ) {
		setAddress(currentIdea.address)
	}

	
	openInfoBlock()

	// tmp
	// showIdeaArguments();
	// showIdeaArgumentReactions(currentIdea, 2)
	
}

function joinStrings(list) {
	list = list.join(', ');
	list = list.replace(/, ([^,]+)$/, ' en $1');
	list = list.replace('ma', 'maandag');
	list = list.replace('di', 'dinsdag');
	list = list.replace('wo', 'woensdag');
	list = list.replace('do', 'donderdag');
	list = list.replace('vr', 'vrijdag');
	list = list.replace('za', 'zaterdag');
	list = list.replace('zo', 'zondag');
	return list;
}

function showNewIdeaForm() {

	if (!userJWT) {
		var infoblock = document.querySelector('#info-block')
		infoblock.innerHTML = document.querySelector('#new-idea-form-not-logged-in-container').innerHTML;
		return;
	}

	var infoblock = document.querySelector('#info-block');
	infoblock.innerHTML = document.querySelector('#new-idea-form-container').innerHTML;
	openInfoBlock()

	infoblock.querySelector('#categorie').value = currentInput.categorie || '';
	infoblock.querySelector('#description').value = currentInput.description || '';
	if (currentInput.location || currentInput.categorie || currentInput.description) openStep(1)
	
	infoblock.querySelector('#weekday').value = currentInput.weekday || '';
	initClickSelectorOptionOption('weekday')
	infoblock.querySelector('#daypart').value = currentInput.daypart || '';
	initClickSelectorOptionOption('daypart')
	infoblock.querySelector('#timeofday').value = currentInput.timeofday || '';
	if (( currentInput.categorie && currentInput.description ) || currentInput.weekday || currentInput.daypart || currentInput.timeofday) openStep(2)

	// todo: images

	var textarea  = document.querySelector('textarea[id="description"]');
	var charsLeft = document.querySelector('#charsLeftDescription');
	initCharactersLeft(textarea, charsLeft, config.ideas.descriptionMinLength, config.ideas.descriptionMaxLength);

}

function cancelNewIdea(form) {
	map.removeMarker(currentInput.marker)
	currentInput = {};
	resetInfoBlock()
}

function validateNewIdeaForm() {

	var isValid = true;

	// location
	if (document.querySelector('#location').value) {
		document.querySelector('#form-warning-location').style.display = 'none';
	} else {
		document.querySelector('#form-warning-location').style.display = 'block';
		isValid = false;
	}

	// categorie
	if (document.querySelector('#categorie').value) {
		document.querySelector('#form-warning-categorie').style.display = 'none';
	} else {
		document.querySelector('#form-warning-categorie').style.display = 'block';
		openStep(1);
		isValid = false;
	}

	// description
	if (document.querySelector('#description').value.length < config.ideas.descriptionMinLength) {
		document.querySelector('#form-warning-description').style.display = 'block';
		document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'kort');
		openStep(1);
		isValid = false;
	} else if (document.querySelector('#description').value.length > config.ideas.descriptionMaxLength) {
		document.querySelector('#form-warning-description').style.display = 'block';
		document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'lang');
		openStep(1);
		isValid = false;
	} else {
		document.querySelector('#form-warning-description').style.display = 'none';
	}

	// time ?

	return isValid;

}

function submitNewIdea(form) {

	if ( !validateNewIdeaForm() ) return;

	if (!userJWT) return showError('Je bent niet ingelogd');

	var url = apiUrl + '/api/site/' + '2' + '/idea';
	console.log(url);

	var body = {
			title: 'Nieuw probleem',
			summary: "Een nieuwe inzending op 'Afval in West'",
			description: form.querySelector('#description').value,
			extraData: {
				categorie: form.querySelector('#categorie').value,
				type: form.querySelector('#type').value,
				time: {
					weekday: JSON.parse(form.querySelector('#weekday').value || '[]'),
					daypart: JSON.parse(form.querySelector('#daypart').value || '[]'),
					timeofday: form.querySelector('#timeofday').value,
				},
			},
	}

	if (form.querySelector('#location').value) {
		body.location = {
			"type": "Point",
			"coordinates": JSON.parse(form.querySelector('#location').value)
		}
	}

	fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'X-Authorization': 'Bearer ' + userJWT,
		},
		body: JSON.stringify(body),
	})
		.then( response => {
			if (response.ok) {
				return response.json()
			}
			throw response.text();
		})
		.then( json => {
			currentMarker.isInput = false;
			currentMarker.idea = json;
			currentInput = {};
			document.querySelector('#info-block').innerHTML = document.querySelector('#new-idea-result-container').innerHTML;
		})
		.catch( error => {
			error.then( messages => showError(messages) );
		});
}

function openStep(stepDiv) {
	if (parseInt(stepDiv) == stepDiv) stepDiv = document.querySelector('#step-'+stepDiv);
	stepDiv.className += ' open';
	areAllStepsOpened();
	if (stepDiv.id == 'step-1') { // zucht
		document.querySelector('#info-block .content').scrollTo(0, 0);
	} else {
		document.querySelector('#info-block .content').scrollTo(0, stepDiv.offsetTop + stepDiv.offsetHeight)
	}
}

function closeStep(stepDiv) {
	if (parseInt(stepDiv) == stepDiv) stepDiv = document.querySelector('#step-'+stepDiv);
	stepDiv.className = stepDiv.className.replace(/( |^)open(?= |$)/g, '');
	areAllStepsOpened();
}


function toggleStep(stepDiv) {
	if (parseInt(stepDiv) == stepDiv) stepDiv = document.querySelector('#step-'+stepDiv);
	if (stepDiv.className.match(/(?: |^)open(?=(?: |$))/)) {
		closeStep(stepDiv);
	} else {
		openStep(stepDiv);
	}
}

function openNextStep() {
	var steps = document.querySelector('#info-block').querySelectorAll('.step');
	for (var i = 0; i < steps.length; i++) {
		var match = steps[i].className.match(/( |^)open( |$)/);
		if (!match) {
			openStep(steps[i]);
			break;
		}
	}
}

function areAllStepsOpened() {
	var steps = document.querySelector('#info-block').querySelectorAll('.step');
	var allStepsAreOpened = true;
	for (var i = 0; i < steps.length; i++) {
		var match = steps[i].className.match(/( |^)open( |$)/);
		if (!match) {
			allStepsAreOpened = false;
		}
	}
	if (allStepsAreOpened) {
		document.querySelector('#info-block').querySelector('#nextButton').className += ' hidden';
		document.querySelector('#info-block').querySelector('#submitButton').className = document.querySelector('#info-block').querySelector('#submitButton').className.replace(/ ?hidden(?: |$)/g, '');
	} else {
		document.querySelector('#info-block').querySelector('#nextButton').className = document.querySelector('#info-block').querySelector('#nextButton').className.replace(/ ?hidden(?: |$)/g, '');
		document.querySelector('#info-block').querySelector('#submitButton').className += ' hidden';
	}
}
