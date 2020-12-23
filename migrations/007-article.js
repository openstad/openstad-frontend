var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query("\
    CREATE TABLE `articles` (\
      `id` int(11) NOT NULL,\
      `siteId` int(11) DEFAULT 0,\
      `userId` int(11) NOT NULL DEFAULT 0,\
      `startDate` datetime NOT NULL,\
      `endDate` datetime DEFAULT NULL,\
      `sort` int(11) NOT NULL DEFAULT 1,\
      `status` enum('OPEN','CLOSED','ACCEPTED','DENIED','BUSY','DONE') NOT NULL DEFAULT 'OPEN',\
      `title` varchar(255) NOT NULL,\
      `summary` text NOT NULL,\
      `description` text NOT NULL,\
      `extraData` text NOT NULL,\
      `location` point DEFAULT NULL,\
      `modBreak` text DEFAULT NULL,\
      `modBreakUserId` int(11) DEFAULT NULL,\
      `modBreakDate` datetime DEFAULT NULL,\
      `createdAt` datetime NOT NULL,\
      `updatedAt` datetime NOT NULL,\
      `deletedAt` datetime DEFAULT NULL\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
    ALTER TABLE `articles`\
      ADD PRIMARY KEY (`id`),\
      ADD KEY `siteId` (`siteId`),\
      ADD KEY `userId` (`userId`);\
    ALTER TABLE `articles`\
      MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;COMMIT;\
    ")
	},
	down: function() {
		return db.query("DROP TABLE `articles`;");
	}
}
