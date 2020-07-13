/**
 * ExternalSites are shared publically with the world
 * Everyone with openstad will be able the share their external sites
 */

module.exports = function( db, sequelize, DataTypes ) {

	const ExternalSite = sequelize.define('externalSite', {

		name: {
			type         : DataTypes.STRING(255),
			allowNull    : true,
			defaultValue : 'Example site...',
		},

		author: {
			type         : DataTypes.STRING(255),
			allowNull    : true,
			defaultValue : 'Amsterdam',
		},

    maintainer: {
      type         : DataTypes.STRING(255),
      allowNull    : true,
      defaultValue : 'Amsterdam',
    },

    description: {
      type         : DataTypes.STRING(2000),
      allowNull    : true,
      defaultValue : 'Description...',
    },

    exampleSite: {
      type         : DataTypes.STRING(255),
      allowNull    : true,
      defaultValue : 'www.example.com',
    },

    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: '{}',
      get: function() {
        let value = this.getDataValue('images');
        try {
          if (typeof value == 'string') {
            value = JSON.parse(value);
          }
        } catch (err) {}
        return value;
      },
      set: function(value) {
        try {
          if (typeof value == 'string') {
            value = JSON.parse(value);
          }
        } catch (err) {}
        this.setDataValue('images', JSON.stringify(value));
      }
    },

    /**
     * [{
     *    String    (version structure)       number
     *    String    (url)                     file
     *    String    (latest                   tag (should be array, but let's keep it simple for now)
     *    String    (text)                    changes
     * }]
     */
    versions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: '[]',
      get: function() {
        let value = this.getDataValue('versions');
        try {
          if (typeof value == 'string') {
            value = JSON.parse(value);
          }
        } catch (err) {}
        return value;
      },
      set: function(value) {
        try {
          if (typeof value == 'string') {
            value = JSON.parse(value);
          }
        } catch (err) {}
        this.setDataValue('versions', JSON.stringify(value));
      }
    },

    /**
     * Try to find Latest version
     */
    latest: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				const versions = this.getDataValue('versions');
        return versions ?
          // try to find with tag latest
          (versions.find(version => version.tag === 'latest')) :
          //If not found will try to pop latest, or if empty return empty object
          (versions && versions.length > 0 ? versions[versions.length - 1] : {});
			}
		},


	});

	ExternalSite.auth = ExternalSite.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'admin',
    updateableBy: 'admin',
    deleteableBy: 'admin',
  }

	return ExternalSite;

};
