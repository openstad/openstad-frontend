var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
			  ALTER TABLE ideas ADD COLUMN typeId varchar(255) NULL AFTER status;
			`);
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query(`ALTER TABLE ideas DROP typeId;`);
	}
}
