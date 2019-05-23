const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Gebiedsontwikkeling tool',
  addFields: [
  //  {
  //    name: 'displayVote',
  //    type: 'string',
  //    label: 'Display vote',
    //  required: true
  //  }
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
