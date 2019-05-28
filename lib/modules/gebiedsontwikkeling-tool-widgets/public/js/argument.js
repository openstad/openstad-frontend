function showIdeaArguments() {

	var infoblock = document.querySelector('#info-block')
	infoblock.innerHTML = document.querySelector('#idea-arguments').innerHTML;

	if (userJWT) {
		infoblock.querySelector('.arguments-form').style.display = 'block';
		infoblock.querySelector('.not-logged-in').style.display = 'none';
		var textarea  = infoblock.querySelector('textarea[id="description"]');
		var charsLeft = infoblock.querySelector('#charsLeftDescription');
		initCharactersLeft(textarea, charsLeft, config.arguments.descriptionMinLength, config.arguments.descriptionMaxLength);
	} else {
		infoblock.querySelector('.arguments-form').style.display = 'none';
		infoblock.querySelector('.not-logged-in').style.display = 'block';
	}

	var template = infoblock.querySelector('.argument');
	if ( currentIdea && currentIdea.argumentsFor ) { // todo: dit moet gewoon arguments worden zo gauw de API dat aan kan
		currentIdea.argumentsFor.forEach(function (argument) {
			var div = template.cloneNode(true);
			if (argument.hasUserVoted) div.querySelector('.votes').className += ' hasvoted';
			div.querySelector('.description').innerHTML = argument.description;
			div.querySelector('.username').innerHTML = argument.user.nickName || ( argument.user.firstName || '' ) + ' ' + ( argument.user.lastName || '' );
			div.querySelector('.date').innerHTML = argument.createDateHumanized;
			div.querySelector('.no-of-votes').innerHTML = argument.yes || 0;
			div.querySelector('.no-of-reactions').innerHTML = ( argument.reactions && argument.reactions.length ) || 0;
			// div.innerHTML = div.innerHTML.replace(/\[\[ideaId\]\]/g, currentIdea.id)
			div.innerHTML = div.innerHTML.replace(/\[\[argumentId\]\]/g, argument.id)
			document.querySelector('.arguments').appendChild(div);
		});
	}
	document.querySelector('.arguments').removeChild(template);

	openInfoBlock()

}

function validateNewArgumentForm() {

	var isValid = true;

	if (document.querySelector('#description').value.length < config.arguments.descriptionMinLength) {
		document.querySelector('#form-warning-description').style.display = 'block';
		document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'kort');
		isValid = false;
	} else if (document.querySelector('#description').value.length > config.arguments.descriptionMaxLength) {
		document.querySelector('#form-warning-description').style.display = 'block';
		document.querySelector('#form-warning-description').innerHTML = document.querySelector('#form-warning-description').innerHTML.replace('[[langkort]]', 'lang');
		isValid = false;
	} else {
		document.querySelector('#form-warning-description').style.display = 'none';
	}

	return isValid;

}

function submitNewArgument(idea, form) {

	if ( !validateNewArgumentForm() ) return;

	if (!userJWT) return showError('Je bent niet ingelogd');

	var url = apiUrl + '/api/site/' + '2' + '/idea/' + idea.id + '/argument';

	var body = {
		ideaId: idea.id,
		description: form.querySelector('#description').value,
		sentiment: 'for', // todo: dit zo optioneel moeten zijn
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
			console.log(json);

			if ( idea && idea.argumentsFor ) { // todo: dit moet gewoon arguments worden zo gauw de API dat aan kan
				idea.argumentsFor.unshift(json)
			}

			showIdeaArguments(idea)

		})
		.catch( error => {
			showError(error);
		});

}

function voteForArgument(idea, argumentId) {

	if (!userJWT) return showError('Je bent niet ingelogd');

	var url = apiUrl + '/api/site/' + '2' + '/idea/' + idea.id + '/argument/' + argumentId + '/vote';

	var body = {
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
			console.log(json);

			if ( idea && idea.argumentsFor ) { // todo: dit moet gewoon arguments worden zo gauw de API dat aan kan
				var template = document.querySelector('#info-block').querySelector('.argument');
				currentIdea.argumentsFor.forEach(function(argument, index) {
					if (argument.id == argumentId) currentIdea.argumentsFor[index] = json;
				})
			}

			showIdeaArguments(idea)

		})
		.catch( error => {
			error.then( messages => showError(messages) );
		});

}
