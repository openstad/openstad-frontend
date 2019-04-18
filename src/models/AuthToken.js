module.exports = function( db, sequelize, DataTypes ) {
	var AuthToken = sequelize.define('auth_token', {
		uid: {
			primaryKey   : true,
			type         : DataTypes.INTEGER.UNSIGNED,
			allowNull    : false
		},
		hashedToken: {
			type         : DataTypes.STRING(160),
			allowNull    : false
		},
		originUrl: {
			type         : DataTypes.TEXT,
			allowNull    : true
		},
		validUntil: {
			type         : DataTypes.DATE,
			allowNull    : false
		}
	}, {
		paranoid : false,
		charset  : 'utf8',
		
		indexes: [{
			fields: ['hashedToken'],
			unique: true
		}],
		
	});

	AuthToken.findByUID = function( uid ) {
		return this.findOne({where: {uid: uid}});
	}
	
	AuthToken.destroyByUID = function( uid ) {
		return this.destroy({where: {uid: uid}});
	}

	return AuthToken;
};
