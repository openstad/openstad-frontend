var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query(`
		  ALTER TABLE sites ADD domain VARCHAR(512) NULL DEFAULT NULL AFTER id;
		`);
	},
	down: function() {
		return db.query(`ALTER TABLE sites DROP domain;`);
	}
}
