var _    = require('lodash');
var util = require('../util');

module.exports = function( db, sequelize, DataTypes ) {
	var models = {};
	util.invokeDir('./', function( modelDef, fileName ) {
		if( models[fileName] ) {
			throw Error('Model with duplicate name: '+fileName);
		}
		models[fileName] = modelDef(db, sequelize, DataTypes);
	}, this);
	
	return models;
};