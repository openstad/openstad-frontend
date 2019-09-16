var Sequelize = require('sequelize');
var _         = require('lodash');
var util      = require('./util');

var config    = require('config');
var dbConfig  = config.get('database');

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
	dialect        : dbConfig.dialect,
	host           : dbConfig.host,
	dialectOptions : {
		charset            : 'utf8_unicode_ci',
		multipleStatements : dbConfig.multipleStatements,
		socketPath         : dbConfig.socketPath
	},
	timeZone       : config.timeZone,
	logging        : require('debug')('app:db:query'),
//  logging: console.log,
	typeValidation : true,

	define: {
		charset        : 'utf8mb4',
		underscored    : false, // preserve columName casing.
		underscoredAll : true, // tableName to table_name.
		paranoid       : true // deletedAt column instead of removing data.
	},
	pool: {
		min  : 0,
		max  : 5,
		idle : 10000
	},
});

// Define models.
var db     = {sequelize: sequelize};
var models = require('./models')(db, sequelize, Sequelize.DataTypes);
_.extend(db, models);

// Invoke associations on each of the models.
_.forEach(models, function( model ) {
	if( model.associate ) {
		model.associate(models);
	}
	if( model.scopes ) {
		_.forEach(model.scopes(), function( scope, name ) {
			model.addScope(name, scope, {override: true});
		});
	}
});

module.exports = db;
