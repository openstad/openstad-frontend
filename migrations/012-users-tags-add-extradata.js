var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query(`
		  ALTER TABLE users ADD extraData JSON NULL AFTER zipcode;
			ALTER TABLE tags ADD extraData JSON NULL AFTER name;
		`);
	},
	down: function() {
		return db.query(`ALTER TABLE users DROP extraData; ALTER TABLE tags DROP extraData;`);
	}
}
