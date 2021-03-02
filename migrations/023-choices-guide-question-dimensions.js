var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
			  ALTER TABLE choicesGuideQuestions ADD dimensions VARCHAR(255) NULL DEFAULT NULL AFTER type; 
			`);
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query(`ALTER TABLE choicesGuideQuestions DROP dimensions;`);
	}
}
