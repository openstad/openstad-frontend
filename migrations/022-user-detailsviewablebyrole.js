var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
			  ALTER TABLE users ADD detailsViewableByRole VARCHAR(255) NULL DEFAULT NULL AFTER listableByRole; 
			`);
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query(`ALTER TABLE users DROP detailsViewableByRole;`);
	}
}
