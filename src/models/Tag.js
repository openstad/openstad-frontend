var sanitize = require('../util/sanitize');
var config = require('config')

module.exports = function( db, sequelize, DataTypes ) {

	var Tag = sequelize.define('tag', {

		siteId: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
		},

		name: {
			type         : DataTypes.STRING,
			allowNull    : false,
			set          : function( text ) {
				this.setDataValue('name', sanitize.title(text.trim()));
			}
		},

	}, {

		hooks: {
		},
    
		individualHooks: true,

	});

	Tag.scopes = function scopes() {

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

	Tag.associate = function( models ) {
		this.belongsToMany(models.Idea, { through: 'IdeaTags' });
	}

	return Tag;

}
