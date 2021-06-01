var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
				CREATE TABLE \`logs\` (
				  \`id\` int NOT NULL AUTO_INCREMENT,
				  \`status\` enum('success','error','info') NOT NULL DEFAULT 'info',
				  \`name\` varchar(255) DEFAULT NULL,
				  \`type\` varchar(255) DEFAULT NULL,
				  \`email\` varchar(255) DEFAULT NULL,
				  \`userId\` int DEFAULT '0',
				  \`actionId\` int DEFAULT '0',
				  \`extraData\` json DEFAULT NULL,
				  \`createdAt\` datetime NOT NULL,
				  \`updatedAt\` datetime NOT NULL,
				  \`deletedAt\` datetime DEFAULT NULL,
				  PRIMARY KEY (\`id\`),
				  KEY \`userId\` (\`userId\`),
				  CONSTRAINT \`actionlogs_ibfk_1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON UPDATE CASCADE
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
