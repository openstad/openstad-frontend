var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
				CREATE TABLE \`actions\` (
				  \`id\` int NOT NULL AUTO_INCREMENT,
				  \`siteId\` int DEFAULT '0',
				  \`accountId\` int DEFAULT '0',
				  \`status\` enum('active','inactive') NOT NULL DEFAULT 'active',
				  \`priority\` int DEFAULT '0',
				  \`name\` varchar(64) DEFAULT NULL,
				  \`type\` enum('continuously','once') DEFAULT 'once',
				  \`runDate\` datetime DEFAULT NULL,
				  \`finished\` tinyint(1) DEFAULT 0,
				  \`settings\` json DEFAULT NULL,
				  \`conditions\` json DEFAULT NULL,
				  \`action\` varchar(64) DEFAULT NULL,
				  \`createdAt\` datetime NOT NULL,
				  \`updatedAt\` datetime NOT NULL,
				  \`deletedAt\` datetime DEFAULT NULL,
				  \`userId\` int DEFAULT NULL,
				  PRIMARY KEY (\`id\`)
				) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
			`);
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query(`ALTER TABLE choicesGuideQuestions DROP moreInfo;`);
	}
}
