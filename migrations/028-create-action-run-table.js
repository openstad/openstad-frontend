var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query(`
				CREATE TABLE \`actionRuns\` (
				  \`id\` int NOT NULL AUTO_INCREMENT,
				  \`status\` enum('running','finished','errored') NOT NULL DEFAULT 'running',
				  \`createdAt\` datetime NOT NULL,
				  \`updatedAt\` datetime NOT NULL,
				  \`deletedAt\` datetime DEFAULT NULL,
				  \`userId\` int DEFAULT NULL,
				  PRIMARY KEY (\`id\`),
				  KEY \`userId\` (\`userId\`),
				  CONSTRAINT \`actionruns_ibfk_1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
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
