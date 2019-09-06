var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query("CREATE TABLE `newslettersignups` (\
        `id` int(11) NOT NULL,\
        `siteId` int(11) DEFAULT '0',\
        `email` varchar(255) NOT NULL,\
        `firstName` varchar(64) DEFAULT NULL,\
        `lastName` varchar(64) DEFAULT NULL,\
        `externalUserId` int(11) DEFAULT NULL,\
        `confirmed` tinyint(1) NOT NULL DEFAULT '0',\
        `confirmToken` varchar(512) DEFAULT NULL,\
        `signoutToken` varchar(512) DEFAULT NULL,\
        `createdAt` datetime NOT NULL,\
        `updatedAt` datetime NOT NULL,\
        `deletedAt` datetime DEFAULT NULL\
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
      ALTER TABLE `newslettersignups`\
        ADD PRIMARY KEY (`id`);\
      ALTER TABLE `newslettersignups`\
        MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
      COMMIT;");
	},
	down: function() {
		return db.query("DROP TABLE `newslettersignups`;");
	}
}
