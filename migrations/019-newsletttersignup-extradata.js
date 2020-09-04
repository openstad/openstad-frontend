var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
			  ALTER TABLE newslettersignups ADD COLUMN extraData JSON NULL AFTER confirmed;
			`);
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query(`ALTER TABLE newslettersignups DROP extraData;`);
	}
}
