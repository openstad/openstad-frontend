var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query("ALTER TABLE `votes` DROP INDEX `votes_idea_id_user_id`, ADD UNIQUE `votes_idea_id_user_id` (`ideaId`, `userId`, `deletedAt`) USING BTREE;");
	},
	down: function() {
		return db.query("ALTER TABLE `votes` DROP INDEX `votes_idea_id_user_id`, ADD UNIQUE `votes_idea_id_user_id` (`ideaId`, `userId`) USING BTREE;");
	}
}
