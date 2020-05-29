var sanitize = require('../util/sanitize');
var config = require('config')

module.exports = function( db, sequelize, DataTypes ) {

	var IdeaTag = sequelize.define('ideaTag', {
	}, {
    paranoid: false
	});

	IdeaTag.scopes = function scopes() {
		return {
			defaultScope: {
			},

      forSiteId: function( siteId ) {
        return {
          where: {
            siteId: siteId,
          }
        };
      },

      includeSite: {
        include: [{
          model: db.Site,
        }]
      },

		}
	}

	return IdeaTag;

}
