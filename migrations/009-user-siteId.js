var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query(`
		  ALTER TABLE users ADD siteId int(11) DEFAULT 0 AFTER id;
		`);
	},
	down: function() {
		return db.query(`ALTER TABLE user DROP siteId;`);
	}
}
