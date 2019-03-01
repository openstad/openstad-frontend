class IdeasWidget extends OpenStadWidget {

	connectedCallback () {
		super.connectedCallback();
		let self = this;
		self.fetch();
	}

	getTemplateHTML() {
		return `{% include "./ideas-widget.html" %}`;
	}
	
	fetch() {
		let self = this;

		// TODO: fetch is too modern, so change or polyfill
		// TODO: CORS
		let url = `{{apiUrl}}/api/site/{{siteId}}/idea/?running=true&includePosterImage=true&includeVoteCount=true`
		url = url + '&access_token=VRIth7Tv1j1tEyQ7Z8TnhSaqnmDXFenXoYCxrjxKMO9QwZYgLEiRfM1IU48zfMCxJEcNBm88HIzznomBhYgC3IRVFs9XguP3vi40';
		fetch(url, {
			method: 'get',
			headers: {
				"Accept": "application/json"
			},
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				// console.log('Request succeeded with JSON response', json);
				self.render(json)
			})
			.catch(function (error) {
				console.log('Request failed', error);
			});
	}

	render(data) {

		let self = this;

		data.forEach(ideaData => {
			var template = self.shadowRoot.querySelector('#idea-template').content.cloneNode(true);
			self.renderIdea(template, ideaData)
		})

		if (self.getAttribute('afterRenderCallback')) {
			// console.log(`${self.getAttribute('afterRenderCallback')}(self)`);
			eval(`${self.getAttribute('afterRenderCallback')}(self)`);
		}

	}

	renderIdea(template, data) {

		let self = this;

		template.querySelector('.idea').id = `idea-${data.id}`;

		let onclick = self.getAttribute('data-onclick') || '';
		template.querySelector('.idea').addEventListener('click', function() { eval(onclick.replace(/\[\[id\]\]/g, data.id)) }, false);
		
		template.querySelector('.idea-title').innerHTML = data.title;
		template.querySelector('.idea-summary').innerHTML = data.summary;
		template.querySelector('.idea-budget').innerHTML = '€ ' + data.budget.toString().replace(/000$/, '.000'); // poor mans sprintf
		template.querySelector('.idea-budget').setAttribute('value', data.budget); // unformatted
		template.querySelector('.idea-counters').innerHTML = `${data.yes}, ${data.no}, ${data.argCount}`;

		// temp, want moet beter
		var imagesElement = document.createElement('idea-images');
		var imageUrl = ( data.posterImage && data.posterImage.key );
		if (imageUrl) {
			imageUrl = '{{imageUrl}}/image/' + imageUrl;
		} else {
			imageUrl = '{{imageUrl}}/img/placeholders/idea.jpg';
		}
		var imageElement = document.createElement('div');
		imageElement.className = 'idea-image';
		var imageDiv = document.createElement('div');
		imageDiv.style.backgroundImage	= 'url(' + imageUrl + ')'
		imageElement.setAttribute( 'image', imageUrl);
		imageElement.appendChild(imageDiv);
		imagesElement.appendChild(imageElement)
		template.querySelector('.idea-images').innerHTML = imagesElement.innerHTML;
		
		self.shadowRoot.querySelector('.ideas-list').appendChild(template)

	}

}

customElements.define('ideas-widget', IdeasWidget);
