var Promise = require('bluebird');
var Umzug   = require('umzug');
var db      = require('./src/db');

var umzug = new Umzug({
	storage: 'sequelize',
	storageOptions : {
		sequelize : db.sequelize,
		modelName : 'Migrations',
		tableName : 'migrations'
	},
	migrations : {
		path    : 'migrations',
		pattern : /^\d+[\w_-]+\.js$/
	}
});

umzug.executed()
.then(function( migrations ) {
	return !migrations.length ?
	       logAllMigrations() :
	       performMigrations();
})
.catch(function( e ) {
	console.log(e);
})
.finally(function() {
	process.exit();
});

function logAllMigrations() {
	console.log('New installation, marking all migrations as done...');
	return umzug.pending()
	.then(function( migrations ) {
		return Promise.all(migrations.map(logMigration));
	});
}
function logMigration( migration ) {
	console.log(migration.file);
	return umzug.storage.logMigration(migration.file);
}
function performMigrations() {
	return umzug.up()
	.then(function( migrations ) {
		if( !migrations.length ) {
			console.log('No new migrations');
		} else {
			console.log('Executed migrations:');
			var fileNames = migrations.map(m => m.file);
			console.log(fileNames.join('\n'));
		}
	});
}