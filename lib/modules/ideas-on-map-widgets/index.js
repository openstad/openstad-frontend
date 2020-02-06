const rp = require('request-promise');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Kaart applicatie',
  addFields: [
//		{
//  		type: 'select',
//  		name: 'displayType',
//  		label: 'Weergave',
//  		choices: [
//  			{
//  				label: 'Simpel',
//  				value: 'simple',
//  				showFields: [
//  					'linkTo'
//  				]
//  			},
//  			{
//  				label: 'Volledig',
//  				value: 'complete'
//  			}
//  		]
//  	},
//    {
//      name: 'linkTo',
//      type: 'string',
//      label: 'Link naar',
//  		required: true
//  	},
//    {
//      name: 'editPage',
//      type: 'string',
//      label: 'Bewerk plan pagina',
//  		required: false
//    }
		{
			name: 'appTitle',
			type: 'string',
			label: 'Titel',
			required: false
		}
  ],
  construct: function(self, options) {

    const superPushAssets = self.pushAssets;
		self.pushAssets = function () {
			superPushAssets();
			self.pushAsset('stylesheet', 'openstad-component-ideas-on-map', { when: 'always' });
			self.pushAsset('script', 'openstad-component-ideas-on-map', { when: 'always' });
    };

    // <link rel="stylesheet" type="text/css" href="dist/css/default.css"/>
	  // <script src="dist/index.js"></script>

    const superLoad = self.load;
		self.load = function(req, widgets, next) {

			widgets.forEach((widget) => {
			  widget.config = JSON.stringify({
          // req.data.isAdmin
          divId: 'ideeen-op-de-kaart',
          appTitle: widget.appTitle,
          siteId: req.data.global.siteId,
          api: {
            url: self.apos.settings.getOption(req, 'apiUrl'),
            headers: req.session.jwt ? { 'X-Authorization': 'Bearer ' + req.session.jwt } : [],
            isUserLoggedIn: req.data.loggedIn,
          },
          user: {
            role:  req.data.openstadUser && req.data.openstadUser.role,
            fullName:  req.data.openstadUser && (req.data.openstadUser.fullName || req.data.openstadUser.firstName + ' ' + req.data.openstadUser.lastName)
          },
			    idea: {
				    titleMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.titleMinLength ) || 30,
				    titleMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.titleMaxLength ) || 200,
				    summaryMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.summaryMinLength ) || 30,
				    summaryMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.summaryMaxLength ) || 200,
				    descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMinLength ) || 30,
				    descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.descriptionMaxLength ) || 200,
			    },
			    argument: {
				    descriptionMinLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMinLength ) || 30,
				    descriptionMaxLength: ( req.data.global.siteConfig && req.data.global.siteConfig.arguments && req.data.global.siteConfig.arguments.descriptionMaxLength ) || 100,
			    },
			    map: {
            variant: "amaps",
            zoom: 16,
            clustering: {
              isActive: true,
            },
            //   polygon: ( req.data.global.siteConfig && req.data.global.siteConfig.openstadMap && req.data.global.siteConfig.openstadMap.polygon ) || undefined,
			    },
        });
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
