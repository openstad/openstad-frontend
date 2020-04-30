const styleSchema = require('../../../config/styleSchema.js').default;
const fs = require('fs');
const assetsGeneration = fs.readFileSync('data/generation').toString(); // TODO: laadt dit ergens eenmalig in en stop het in een global var
const openstadComponentsUrl = process.env.OPENSTAD_COMPONENTS_URL || '/openstad-components';
const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Vorige volgende knoppen',
  addFields: [
		{
			name: 'previousUrl',
      type: 'string',
			label: 'Url achter de \'vorige\' knop',
			required: true
		},
		{
			name: 'previousLabel',
      type: 'string',
			label: 'Tekst op de \'vorige\' knop',
			required: true
		},
		{
			name: 'nextUrl',
      type: 'string',
			label: 'Url achter de \'volgende\' knop',
			required: true
		},
		{
			name: 'nextLabel',
      type: 'string',
			label: 'Tekst op de \'volgende\' knop',
			required: true
		},
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

			widgets.forEach((widget) => {
			  widget.config = JSON.stringify({
          // req.data.isAdmin
          divId: 'previous-next-button-block',
          previousUrl: widget.previousUrl,
          previousLabel: widget.previousLabel,
          nextUrl: widget.nextUrl,
          nextLabel: widget.nextLabel,
        });
        widget.openstadComponentsUrl = openstadComponentsUrl;
        widget.assetsGeneration = assetsGeneration.trim();
        const containerId = styleSchema.generateId();
        widget.containerId = containerId;
        widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
			});

			return superLoad(req, widgets, next);
			next();
		}

    const superOutput = self.output;
    self.output = function(widget, options) {
      return superOutput(widget, options);
    };

  }
};
