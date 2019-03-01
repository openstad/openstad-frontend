class IdeasGridderWidget extends IdeasWidget {

	connectedCallback () {

		super.connectedCallback();
		let self = this;


	}

	getTemplateHTML() {
		return `{% include "./ideas-gridder-widget.html" %}`;
	}

	render(data) {

		let self = this;

		self.shadowRoot.querySelector('.ideas').handleClick = function(e) {
			console.log('HANDLECLICK');
		}

		data.forEach(ideaData => {
			var template = self.shadowRoot.querySelector('#idea-template').content.cloneNode(true);
			self.renderIdea(template, ideaData)
		})

		// load grinder
		var script1 = document.createElement('script');
		// first: load jquery
		script1.src = '/js/jquery-3.3.1.min.js';
		script1.type = 'text/javascript';
		script1.onload = function () {
			// hele vuile hack om grinder te laten werken; nu doet jquery het verder niet meer
			let old = window.$;
			window.$ = function override(selector, that) {
				return old(self.shadowRoot.querySelectorAll(selector));
			}
			// load gridder
			var script2 = document.createElement('script');
			script2.src = '/js/jquery.gridder.for.widgets.js';
			script2.type = 'text/javascript';
			script2.onload = function () {
				// init grinder
				$('.gridder').gridderExpander({
					scroll: true,
					scrollOffset: 100,
					scrollTo: "panel",                  // panel or listitem
					animationSpeed: 300,
					animationEasing: "easeInOutExpo",
					showNav: true,                      // Show Navigation
					nextText: "<span></span>", // Next button text
					prevText: "<span></span>", // Previous button text
					closeText: "", // Close button text                // Close button text
					onStart: function(target) {
						var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging
						this.scrollOffset = isPhone ? -40: 100;
					},
					onContent: function(args){
						var element = args[0];
						// var ideaId = element.querySelector('.thisIdeaId').innerHTML;
						// window.history.replaceState({}, '', '#showidea-' + ideaId);
						// return false;
					},
					onClosed: function(){
						window.history.replaceState({}, '', '#');
					}
				})
			};
			self.shadowRoot.appendChild(script2)
		};
		self.shadowRoot.appendChild(script1)

		if (self.getAttribute('afterRenderCallback')) {
			// console.log(`${self.getAttribute('afterRenderCallback')}(self)`);
			eval(`${self.getAttribute('afterRenderCallback')}(self)`);
		}

	}

	renderIdea(template, data) {

		let self = this;

		template.querySelector('li').id = 'idea-' + data.id;
		template.querySelector('li').setAttribute('data-griddercontent', '#idea-content-' + data.id)
		template.querySelector('.idea-extra').innerHTML = 'Niels is gek';
		template.querySelector('.idea-content-title').innerHTML = data.title;

		let gridderContent = template.querySelector('li').querySelector('.gridder-content');
		gridderContent.id = 'idea-content-' + data.id;
		gridderContent.querySelector('.thisIdeaId').innerHTML = data.id;
		
		super.renderIdea(template, data)

	}

}

customElements.define('ideas-gridder-widget', IdeasGridderWidget);
