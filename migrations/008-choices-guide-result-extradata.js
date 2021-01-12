var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query(`
		  ALTER TABLE choicesGuideResults ADD extraData TEXT NULL AFTER userId;
		`);
	},
	down: function() {
		return db.query(`ALTER TABLE choicesGuideResults DROP extraData;`);
	}
}
