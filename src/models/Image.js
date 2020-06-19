var path = require('path');
var config = require('config');

module.exports = function( db, sequelize, DataTypes ) {
	var Image = sequelize.define('image', {

		ideaId: {
			type      : DataTypes.INTEGER,
			allowNull : true
		},

		userId: {
			type      : DataTypes.INTEGER,
			allowNull : false,
			defaultValue: 0,
		},

		key: {
			type      : DataTypes.STRING(255),
			allowNull : false,
			validate  : {
				len: [13,255] // UNIX timestamp in ms is 13 numbers
			}
		},

		mimeType: {
			type      : DataTypes.STRING(32),
			allowNull : false
		},

		extraData: {
			type				 : DataTypes.TEXT,
			allowNull		 : false,
			defaultValue : '{}',
			get					 : function() {
				// for some reaason this is not always done automatically
				let value = this.getDataValue('extraData');
				try {
					if (typeof value == 'string') {
						value = JSON.parse(value);
					}
				} catch(err) {}
				return value;
			},
			set: function(value) {
				value = value || {};
				try {
					if (typeof value == 'string') {
						value = JSON.parse(value);
					}
				} catch(err) {}
				let newValue = {};
				let configExtraData = config.images && config.images.extraData;
				if (configExtraData) {
					Object.keys(configExtraData).forEach((key) => {
						if (configExtraData[key].allowNull === false && typeof value[key] === 'undefined') { // TODO: dit wordt niet gechecked als je het veld helemaal niet meestuurt
							throw Error(`${key} is niet ingevuld`);
						}
						if (typeof value[key] == 'number') { // TODO: alles is nu int, maar dit is natuurlijk veel te simpel
							newValue[key] = value[key];
						}
					});
				}
				this.setDataValue('extraData', JSON.stringify(newValue));
			}
		},

		sort: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
			defaultValue : 0
		},

		data: {
			type      : DataTypes.BLOB('long'),
			allowNull : false
		},

		processed: {
			type         : DataTypes.BOOLEAN,
			allowNull    : false,
			defaultValue : false
		}
	}, {
		paranoid : false,
		charset  : 'utf8',
		
		indexes: [{
			fields : ['key'],
			unique : true
		}],
		
	});

	Image.associate = function( models ) {
		this.belongsTo(models.Idea);
	}
	
	Image.thumbName = function( fileName ) {
		var extName  = path.extname(fileName);
		var baseName = path.basename(fileName, extName);
		if( baseName.substr(-6) === '_thumb' ) {
			return fileName;
		} else {
			return `${baseName}_thumb${extName}`;
		}
	}

  // volgens mij wordt dit niet meer gebruikt
	Image.auth = Image.prototype.auth = {
    listableBy: 'admin',
    viewableBy: 'admin',
    createableBy: 'admin',
    updateableBy: 'admin',
    deleteableBy: 'admin',
  }

	return Image;

};
