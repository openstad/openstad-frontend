const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Gebiedsontwikkeling tool',
  addFields: [
		{
			type: 'select',
			name: 'displayType',
			label: 'Weergave',
			choices: [
				{
					label: 'Simpel',
					value: 'simple',
					showFields: [
						'linkTo'
					]
				},
				{
					label: 'Volledig',
					value: 'complete'
				}
			]
		},
    {
      name: 'linkTo',
      type: 'string',
      label: 'Link naar',
			required: true
		},
    {
      name: 'maxClusterRadius',
      type: 'integer',
      label: 'Gevoeligheid van clusering',
			def: 40
		},
    {
      name: 'editPage',
      type: 'string',
      label: 'Bewerk plan pagina',
			required: false
    }
  ],
  construct: function(self, options) {

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
			self.pushAsset('stylesheet', 'argument', { when: 'always' });
			self.pushAsset('stylesheet', 'argument-reaction', { when: 'always' });
			self.pushAsset('stylesheet', 'default', { when: 'always' });
			self.pushAsset('stylesheet', 'form', { when: 'always' });
			self.pushAsset('stylesheet', 'idea', { when: 'always' });
			self.pushAsset('stylesheet', 'openstad-map', { when: 'always' });
			self.pushAsset('stylesheet', 'gebiedsontwikkeling-tool', { when: 'always' });

			self.pushAsset('script', 'argument', { when: 'always' });
			self.pushAsset('script', 'argument-reaction', { when: 'always' });
			self.pushAsset('script', 'default', { when: 'always' });
			self.pushAsset('script', 'form', { when: 'always' });
			self.pushAsset('script', 'idea', { when: 'always' });
			self.pushAsset('script', 'openstad-map', { when: 'always' });
			self.pushAsset('script', 'gebiedsontwikkeling-tool', { when: 'always' });
    };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {
			widgets.forEach((widget) => {
				widget.siteId = req.data.global.siteId;
				widget.apiUrl = self.apos.settings.getOption(req, 'apiUrl');;
				widget.userJWT = req.session.jwt;
				widget.siteConfig = {
					ideas: {
						descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMinLength ) || 30,
						descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMaxLength ) || 200,
					},
					arguments: {
						descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMinLength ) || 30,
						descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMaxLength ) || 100,
					},
					openstadMap: {
						polygon: ( req.data.global.siteConfig && req.data.global.siteConfig.openstadMap && req.data.global.siteConfig.openstadMap.polygon ) || undefined,
					},
				}
				widget.editIdeaPage = ( req.data.isAdmin && widget.editPage ) || '';
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
