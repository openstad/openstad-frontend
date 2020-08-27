var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query("CREATE TABLE `externalSites` (\
					  `id` int NOT NULL AUTO_INCREMENT,\
					  `name` varchar(255) DEFAULT 'Example site...',\
					  `author` varchar(255) DEFAULT 'Amsterdam',\
					  `maintainer` varchar(255) DEFAULT 'Amsterdam',\
					  `description` varchar(2000) DEFAULT 'Description...',\
					  `exampleSite` varchar(255) DEFAULT 'www.example.com',\
					  `images` json NOT NULL,\
					  `versions` json NOT NULL,\
					  `createdAt` datetime NOT NULL,\
					  `updatedAt` datetime NOT NULL,\
					  `deletedAt` datetime DEFAULT NULL,\
					  PRIMARY KEY (`id`)\
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
			");
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query('DROP TABLE `newslettersignups`;');
	}
}
