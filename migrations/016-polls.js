var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		try {
			return db.query("SET AUTOCOMMIT = 0; START TRANSACTION;\
        DROP TABLE IF EXISTS `poll_votes`;\
        DROP TABLE IF EXISTS `poll_options`;\
        DROP TABLE IF EXISTS `pollVotes`;\
        DROP TABLE IF EXISTS `polls`;\
        CREATE TABLE `polls` (\
          `id` int(11) NOT NULL,\
          `ideaId` int(11) NOT NULL,\
          `userId` int(11) NOT NULL DEFAULT 0,\
          `status` enum('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN',\
          `question` varchar(255) NOT NULL,\
          `choices` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,\
          `createdAt` datetime NOT NULL,\
          `updatedAt` datetime NOT NULL,\
          `deletedAt` datetime DEFAULT NULL\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
        CREATE TABLE `pollVotes` (\
          `id` int(11) NOT NULL,\
          `pollId` int(11) NOT NULL,\
          `userId` int(11) NOT NULL DEFAULT 0,\
          `ip` varchar(64) DEFAULT NULL,\
          `choice` varchar(255) NOT NULL,\
          `createdAt` datetime NOT NULL,\
          `updatedAt` datetime NOT NULL,\
          `deletedAt` datetime DEFAULT NULL\
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
        ALTER TABLE `polls`\
          ADD PRIMARY KEY (`id`),\
          ADD KEY `ideaId` (`ideaId`),\
          ADD KEY `userId` (`userId`);\
        ALTER TABLE `pollVotes`\
          ADD PRIMARY KEY (`id`),\
          ADD UNIQUE KEY `poll_votes_poll_id_user_id` (`pollId`,`userId`),\
          ADD KEY `userId` (`userId`);\
        ALTER TABLE `polls`\
          MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
        ALTER TABLE `pollVotes`\
          MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
        ALTER TABLE `polls`\
          ADD CONSTRAINT `polls_ibfk_1` FOREIGN KEY (`ideaId`) REFERENCES `ideas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,\
          ADD CONSTRAINT `polls_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;\
        ALTER TABLE `pollVotes`\
          ADD CONSTRAINT `pollVotes_ibfk_1` FOREIGN KEY (`pollId`) REFERENCES `polls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,\
          ADD CONSTRAINT `pollVotes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;\
        COMMIT;");
		} catch(e) {
			return true;
		}
	},
	down: function() {
		return db.query('DROP TABLE `polls`; DROP TABLE `pollVotes`;');
	}
}
