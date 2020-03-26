function fetchIdeaArguments(callback) {

	$.ajax({
		url: apiUrl + '/api/site/' + siteId + '/idea/' + currentIdea.id + '?includeUser=1&includeArguments=1?includeUserVote=1',
		dataType: "json",
		crossDomain: true,
		beforeSend: function(request) {
			request.setRequestHeader("Accept", "application/json");
			if (userJWT) {
				request.setRequestHeader('X-Authorization', 'Bearer ' + userJWT);
			}
		},
		success: function(result) {
			currentIdea.argumentsFor = result.argumentsFor;
			if (callback) {
				callback.call();
				var content = document.querySelector('#info-block .content');
				if (content.scrollTo) content.scrollTo(0, content.offsetTop + content.offsetHeight + 1000)
			}
		},
		error: function(error) {
			showError(error);
		}
	});

}

// end showIdeasOnMap
// ----------------------------------------------------------------------------------------------------

function showIdeaArguments() {

	var infoblock = document.querySelector('#info-block')
	infoblock.innerHTML = document.querySelector('#idea-arguments').innerHTML;

	infoblock.innerHTML = infoblock.innerHTML.replace(/\[\[ideaId\]\]/g, currentIdea.id);

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
			div.id = 'argument-' + argument.id;
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

	infoblock.querySelector('#back-to-idea-details-button-text').innerHTML = 'Terug naar probleem';

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

	var url = apiUrl + '/api/site/' + siteId + '/idea/' + idea.id + '/argument';

	var body = {
		ideaId: idea.id,
		description: form.querySelector('#description').value,
		sentiment: 'for', // todo: dit zo optioneel moeten zijn
	}

	$.ajax({
		url: url,
		dataType: "json",
		crossDomain: true,
		method: "POST",
		data: body,
		beforeSend: function(request) {
			request.setRequestHeader("Accept", "application/json");
			request.setRequestHeader('X-Authorization', 'Bearer ' + userJWT);
		},
		success: function(ideas) {
			fetchIdeaArguments(showIdeaArguments);
		},
		error: function(error) {
			showError(error);
		}
	});

}

function voteForArgument(idea, argumentId) {

	if (!userJWT) return showError('Je bent niet ingelogd');

	var url = apiUrl + '/api/site/' + siteId + '/idea/' + idea.id + '/argument/' + argumentId + '/vote';

	var body = {
	}

	$.ajax({
		url: url,
		dataType: "json",
		crossDomain: true,
		method: "POST",
		data: body,
		beforeSend: function(request) {
			request.setRequestHeader("Accept", "application/json");
			request.setRequestHeader('X-Authorization', 'Bearer ' + userJWT);
		},
		success: function(json) {
			var hasUserVoted;
			var noOfVotes;
			if ( idea && idea.argumentsFor ) { // todo: dit moet gewoon arguments worden zo gauw de API dat aan kan
				var template = document.querySelector('#info-block').querySelector('.argument');
				currentIdea.argumentsFor.forEach(function(argument, index) {
					if (argument.id == argumentId) {
						hasUserVoted = json.hasUserVoted == '1';
						noOfVotes = json.yes;
					}
				})
			}

			var div = document.querySelector('#argument-' + argumentId).querySelector('.votes');
			div.className = div.className.replace(new RegExp(' ?hasvoted(?: |$)', 'g' ), '');
			div.querySelector('.no-of-votes').innerHTML = noOfVotes || 0;
			if (hasUserVoted) {
				div.className += ' hasvoted'
			}
		},
		error: function(error) {
			showError(error);
		}
	});

}
