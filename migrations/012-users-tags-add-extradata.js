var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
			  ALTER TABLE users ADD extraData JSON NULL AFTER zipcode;
				ALTER TABLE tags ADD extraData JSON NULL AFTER name;
			`);
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query(`ALTER TABLE users DROP extraData; ALTER TABLE tags DROP extraData;`);
	}
}
