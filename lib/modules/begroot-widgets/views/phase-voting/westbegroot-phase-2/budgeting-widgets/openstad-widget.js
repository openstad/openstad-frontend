class OpenStadWidget extends HTMLElement {

	constructor(...args) {
		let self = super(...args);
		self.createShadowRoot()
	}

	connectedCallback () {

		let self = this;

		if (self.getAttribute('data-css')) {
			console.log('extra CSS')
			let link = document.createElement('link');
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = self.getAttribute('data-css');
			self.shadowRoot.appendChild(link)
		}

	}

	createShadowRoot() {

		let self = this;

		var template = document.createElement('template');
		template.innerHTML = self.getTemplateHTML();
		var shadowRoot = self.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));

	}

	getTemplateHTML() {
		return `{% include "./ideas-widget.html" %}`;
	}

}

customElements.define('openstad-widget', OpenStadWidget);
