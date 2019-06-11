var imageuploader;

function showIdeaDetails() {

	var infoblock = document.querySelector('#info-block')
	infoblock.innerHTML = document.querySelector('#idea-details').innerHTML;

	var images = currentIdea && currentIdea.extraData && currentIdea.extraData.images;
	if (images) {
		infoblock.querySelector('.idea-details .images').innerHTML = '';
		images.forEach((image) => {
			let html = infoblock.querySelector('.idea-details .image-template').innerHTML;
			html = html.replace('[[src]]', image);
			infoblock.querySelector('.idea-details .images').innerHTML += html;
		});
	}

	infoblock.querySelector('.idea-details #description').innerHTML = currentIdea && currentIdea.description;
	infoblock.querySelector('.idea-details #solution').innerHTML = currentIdea && currentIdea.extraData && currentIdea.extraData.solution;
	infoblock.querySelector('.idea-details #categorie').innerHTML = currentIdea && currentIdea.extraData && currentIdea.extraData.categorie;
	infoblock.querySelector('.idea-details #type').innerHTML = ( currentIdea && currentIdea.extraData && currentIdea.extraData.type ) || 'n.v.t.';
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
		infoblock.querySelector('.idea-details #time').innerHTML = html;
		infoblock.querySelector('.idea-details .extra-data .right').style.display = 'block';
	}
	if (!time || !html) {
		infoblock.querySelector('.idea-details .extra-data .right').style.display = 'none';
	}

	infoblock.querySelector('.idea-details #username').innerHTML = currentIdea && currentIdea.user && ( ( currentIdea.user.firstName || '' ) + ' ' + ( currentIdea.user.lastName || '' ) );
	infoblock.querySelector('.idea-details #date').innerHTML = currentIdea  && currentIdea.startDateHumanized;

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
		openInfoBlock()
		return;
	}

	var infoblock = document.querySelector('#info-block');
	infoblock.innerHTML = document.querySelector('#new-idea-form-container').innerHTML;
	openInfoBlock()

	infoblock.querySelector('#new-idea-form #categorie').value = currentInput.categorie || '';
	infoblock.querySelector('#new-idea-form #type').value = currentInput.type || '';
	infoblock.querySelector('#new-idea-form #solution').value = currentInput.solution || '';
	if (currentInput.location || currentInput.categorie || currentInput.solution) openStep(1)

	infoblock.querySelector('#new-idea-form #weekday').value = currentInput.weekday || '';
	initClickSelectorOptionOption('weekday')
	infoblock.querySelector('#new-idea-form #daypart').value = currentInput.daypart || '';
	initClickSelectorOptionOption('daypart')
	infoblock.querySelector('#new-idea-form #timeofday').value = currentInput.timeofday || '';
	if (( currentInput.categorie && currentInput.description && currentInput.solution  ) || currentInput.weekday || currentInput.daypart || currentInput.timeofday) openStep(2)

	var textarea  = document.querySelector('#new-idea-form textarea[id="description"]');
	var charsLeft = document.querySelector('#new-idea-form #charsLeftDescription');
	initCharactersLeft(textarea, charsLeft, config.ideas.descriptionMinLength, config.ideas.descriptionMaxLength);

	var textarea  = document.querySelector('#new-idea-form textarea[id="solution"]');
	var charsLeft = document.querySelector('#new-idea-form #charsLeftSolution');
	initCharactersLeft(textarea, charsLeft, config.ideas.descriptionMinLength, config.ideas.descriptionMaxLength);

	initImageUpload()

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

	// solution
	console.log(document.querySelector('#solution').value.length + ' < ' +
							config.ideas.descriptionMinLength)
	console.log(document.querySelector('#solution').value.length + ' > ' +
							config.ideas.descriptionMaxLength)

	if (document.querySelector('#solution').value.length < config.ideas.descriptionMinLength) {
		document.querySelector('#form-warning-solution').style.display = 'block';
		document.querySelector('#form-warning-solution').innerHTML = document.querySelector('#form-warning-solution').innerHTML.replace('[[langkort]]', 'kort');
		openStep(1);
		isValid = false;
	} else if (document.querySelector('#solution').value.length > config.ideas.descriptionMaxLength) {
		document.querySelector('#form-warning-solution').style.display = 'block';
		document.querySelector('#form-warning-solution').innerHTML = document.querySelector('#form-warning-solution').innerHTML.replace('[[langkort]]', 'lang');
		openStep(1);
		isValid = false;
	} else {
		document.querySelector('#form-warning-solution').style.display = 'none';
	}

	// time ?

	return isValid;

}

function submitNewIdea(form) {

	if ( !validateNewIdeaForm() ) return;

	if (!userJWT) return showError('Je bent niet ingelogd');

	var url = apiUrl + '/api/site/' + '2' + '/idea';

	var body = {
			title: 'Nieuw probleem',
			summary: "Een nieuwe inzending op 'Afval in West'",
			description: form.querySelector('#description').value,
			extraData: {
				categorie: form.querySelector('#categorie').value,
				type: form.querySelector('#type').value,
				solution: form.querySelector('#solution').value,
				time: {
					weekday: JSON.parse(form.querySelector('#weekday').value || '[]'),
					daypart: JSON.parse(form.querySelector('#daypart').value || '[]'),
					timeofday: form.querySelector('#timeofday').value,
				},
				images: []
			},
	}

	if (form.querySelector('#location').value) {
		body.location = JSON.stringify({
			"type": "Point",
			"coordinates": JSON.parse(form.querySelector('#location').value)
		})
	}

	if ( imageuploader && imageuploader.getFiles ) {
		var images = imageuploader.getFiles();
		images.forEach((image) => {
			try {
				var serverId = JSON.parse(image.serverId)
				body.extraData.images.push(serverId.url)
			} catch(err) { console.log(err) }
		});
	}

	fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'X-Authorization': 'Bearer ' + userJWT,
		},
		body: JSON.stringify(body),
	})
		.then( function (response) {
			if (response.ok) {
				return response.json()
			}
			throw response.text();
		})
		.then(function (json){
			currentMarker.isInput = false;
			currentMarker.idea = json;
			currentInput = {};
			document.querySelector('#info-block').innerHTML = document.querySelector('#new-idea-result-container').innerHTML;
		})
		.catch(function (error) {
			error.then(function (messages) { return showError(messages)} );
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
