module.exports = function( db, sequelize, DataTypes ) {
	var Session = sequelize.define('session', {

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

  // wordt deze nog gebruikt?
	Session.auth = Session.prototype.auth = {
    listableBy: 'editor',
    viewableBy: 'all',
    createableBy: 'anonymous',
    updateableBy: ['editor','owner'],
    deleteableBy: ['editor','owner'],
  }

  return Session;
  
};
