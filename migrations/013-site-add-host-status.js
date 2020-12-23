var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
			  ALTER TABLE sites ADD COLUMN hostStatus JSON NULL AFTER config;
			`);
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query(`ALTER TABLE sites DROP hostStatus;`);
	}
}
