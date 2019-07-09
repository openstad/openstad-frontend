var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query(`
		  ALTER TABLE users ADD externalAccessToken VARCHAR(2048) NULL AFTER externalUserId;
		`);
	},
	down: function() {
		return db.query(`ALTER TABLE users DROP externalAccessToken;`);
	}
}
