var Sequelize = require('sequelize');
var _         = require('lodash');
var util      = require('./util');

var config    = require('config');
var dbConfig  = config.get('database');

// newer versions of mysql (8+) have changed GeomFromText to ST_GeomFromText
// this is a fix for sequalize
if (dbConfig.mysqlSTGeoMode || process.env.MYSQL_ST_GEO_MODE === 'on') {
	const wkx = require('wkx')
	Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
	  return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
	}
	Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
	  return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
	}
	Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
	  return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
	}
	Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
	  return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
	}
}


var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
	dialect        : dbConfig.dialect,
	host           : dbConfig.host,
	port					: dbConfig.port || 3306,
	dialectOptions : {
		charset            : 'utf8_unicode_ci',
		multipleStatements : dbConfig.multipleStatements,
		socketPath         : dbConfig.socketPath
	},
	timeZone       : config.timeZone,
	logging        : require('debug')('app:db:query'),
 	// logging				 : console.log,
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

// authentication mixins
const mixins = require('./lib/sequelize-authorization/mixins');
Object.keys(models).forEach((key) => {
  let model = models[key];
  model.can = model.prototype.can = mixins.can;
  model.prototype.toJSON = mixins.toAuthorizedJSON;
  model.authorizeData = model.prototype.authorizeData = mixins.authorizeData;
});

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
