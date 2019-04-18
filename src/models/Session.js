module.exports = function( db, sequelize, DataTypes ) {
	return sequelize.define('session', {

		sid: {
			type       : DataTypes.STRING(32),
			primaryKey : true
		},

		expires: DataTypes.DATE,

		data: DataTypes.TEXT

	}, {
		paranoid : false,
		charset  : 'utf8',
	});

};
