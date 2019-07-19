var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query(`
		  ALTER TABLE votes CHANGE opinion opinion VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL;
      ALTER TABLE votes CHANGE confirmIdeaId confirmReplacesVoteId INT(11) NULL DEFAULT NULL;
		`);
	},
	down: function() {
	}
}
