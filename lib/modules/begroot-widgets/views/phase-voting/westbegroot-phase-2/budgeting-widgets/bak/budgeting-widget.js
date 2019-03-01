class BudgetingWidget extends OpenStadWidget {

	getTemplateHTML() {
		return `{% include "./budgeting-widget.html" %}`;
	}

	connectedCallback () {

		super.connectedCallback();

		let self = this;

		if (!window.sessionStorage.getItem('currentBudget')) {
			window.sessionStorage.setItem('currentBudget', '[]');
		}
		self.currentBudget = JSON.parse(window.sessionStorage.getItem('currentBudget'));

		self.userAccessToken = '{{accessToken}}';

		// console.log('===1', self.shadowRoot.getElementById('test1'));
		// console.log('===2', self.shadowRoot.getElementById('test2'));

		// document.querySelector('#budget-ideas').setAttribute('afterRenderCallback', 'document.querySelector(\'budgeting-widget\').updateBudgetView');

		// ["DOMNodeInserted", "DOMAttrModified", "DOMNodeRemoved"].forEach(function (eventName) {
		//  	self.shadowRoot.addEventListener(eventName, self.test, true);
		// });

		window.addEventListener('WebComponentsReady', function() {
			document.querySelector('#budget-ideas').setAttribute('afterRenderCallback', 'document.querySelector(\'budgeting-widget\').updateBudgetView')
		}, true);

		if (window.location.search.match(/returnFromLogin=true/)) {
			self.sendBudget();
		}

	}

	test(e) {
		console.log('===', document.getElementById('budget-ideas'));
		console.log('mutation', e);
	}

	createdCallback() {
		console.log('createdCallback')
	}

	adoptedCallback() {
		console.log('adoptedCallback')
	}
	
	addIdeaToBudget(ideaId) {
		let self = this;
		if (self.currentBudget.indexOf(ideaId) == -1) {
			self.currentBudget.push(ideaId)
		}
		self.updateBudgetStore();
		self.updateBudgetView();
	}

	removeIdeaFromBudget(ideaId) {
		let self = this;
		let index = self.currentBudget.indexOf(ideaId);
		if (index != -1) {
			self.currentBudget.splice(index, 1)
		}
		self.updateBudgetStore();
		self.updateBudgetView();
	}

	updateBudgetStore() {
		let self = this;
		window.sessionStorage.setItem('currentBudget', JSON.stringify(self.currentBudget));
	}

	updateBudgetView() {

		let self = this;
		let viewElement = self.shadowRoot.querySelector('#budgetView');
		let totalElement = self.shadowRoot.querySelector('#budgetTotal');

		let innerHTML = '';
		let budget = 0;
		self.currentBudget.map(ideaId => {

			let idea = document.querySelector('#budget-ideas').shadowRoot.querySelector(`#idea-${ideaId}`);

			let width = 100;
			let height = 100;
			let img = idea.querySelector('.idea-image').getAttribute('image');

			innerHTML += `<div class="budget-idea-image" style="display: inline-block; width: ${width}px; height: ${height}px; background-image: url('${img}'); cursor: pointer;" onclick="document.querySelector('budgeting-widget').removeIdeaFromBudget(${ideaId})"></div>\n`;

			budget += parseInt(idea.querySelector('.idea-budget').getAttribute('value'));
			

		});
		viewElement.innerHTML = innerHTML;
		totalElement.innerHTML = 'Totaal: € ' + budget.toString().replace(/000$/, '.000'); // poor mans sprintf;

	}

	sendBudget(confirmed) {
		let self = this;

		if (!self.userAccessToken) {
			console.log('?');
			return self.showInfoPopup('you-must-login-first');
		}

		if (!confirmed) {
			return self.showInfoPopup('you-are-about-to-vote');
		}

		let data = {
			budgetVote: self.currentBudget,
			_csrf: '{{csrfToken}}',
		}

		// TODO: fetch is too modern, so change or polyfill
		// TODO: CORS
		let url = `{{apiUrl}}/api/site/{{siteId}}/budgeting?`
		url = url + `&access_token=${self.userAccessToken}`;
		fetch(url, {
			method: 'post',
			headers: {
				"Content-type": "application/json",
				"Accept": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then( response => response.json() )
			.then( function (json) {
				if (json.status && json.status != 200) throw json.message;
				self.showInfoPopup('success')

				// na het stemmen bewaren we niets meer
				self.currentBudget = [];
				self.updateBudgetStore();
				
			})
			.catch( function (error) {
				console.log('Request failed', error);
				self.showInfoPopup('error', error)
			});

		
	}

	showInfoPopup(which, content) {
		let self = this;
		self.hideInfoPopupContent()
		self.shadowRoot.querySelector('#info-popup').style.display = 'block';
		let popup = self.shadowRoot.querySelector(`#${which}`);
		popup.style.display = 'block';
		if (content) popup.innerHTML = content;
		let handler = self.infoPopupEventListener.bind(self);
		document.addEventListener('keyup', handler, false)
		self.shadowRoot.querySelector('#info-popup').addEventListener('mousedown', handler, false)
	}

	hideInfoPopupContent() {
		let self = this;
		let popup = self.shadowRoot.querySelector('#info-popup')
		popup.querySelector('#you-must-login-first').style.display = 'none';
		popup.querySelector('#you-are-about-to-vote').style.display = 'none';
		popup.querySelector('#error').style.display = 'none';
		popup.querySelector('#success').style.display = 'none';
	}


	hideInfoPopup() {
		let self = this;
		let popup = self.shadowRoot.querySelector('#info-popup')
		popup.style.display = 'none';
		self.hideInfoPopupContent()
	}

	infoPopupEventListener(event) {
		let self = this;
    if (event.which == 27 || (event.target == self.shadowRoot.querySelector('#info-popup'))) { // escape
			self.hideInfoPopup()
		}
	}

}

customElements.define('budgeting-widget', BudgetingWidget);
