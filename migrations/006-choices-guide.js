var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query("\
    CREATE TABLE `choicesGuideChoices` (\
      `id` int(11) NOT NULL,\
      `choicesGuideId` int(11) DEFAULT NULL,\
      `questionGroupId` int(11) DEFAULT NULL,\
      `title` varchar(255) NOT NULL,\
      `description` text NOT NULL,\
      `images` text NOT NULL,\
      `answers` text,\
      `seqnr` int(11) NOT NULL DEFAULT '0',\
      `createdAt` datetime NOT NULL,\
      `updatedAt` datetime NOT NULL,\
      `deletedAt` datetime DEFAULT NULL\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
    CREATE TABLE `choicesGuideQuestionGroups` (\
      `id` int(11) NOT NULL,\
      `choicesGuideId` int(11) NOT NULL,\
      `answerDimensions` int(11) NOT NULL DEFAULT '1',\
      `title` varchar(255) NOT NULL,\
      `description` text NOT NULL,\
      `images` text NOT NULL,\
      `seqnr` int(11) NOT NULL DEFAULT '0',\
      `createdAt` datetime NOT NULL,\
      `updatedAt` datetime NOT NULL,\
      `deletedAt` datetime DEFAULT NULL\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
    CREATE TABLE `choicesGuideQuestions` (\
      `id` int(11) NOT NULL,\
      `questionGroupId` int(11) NOT NULL,\
      `title` varchar(255) NOT NULL,\
      `description` text NOT NULL,\
      `images` text NOT NULL,\
      `type` enum('continuous','a-to-b','enum-buttons','enum-radio') NOT NULL DEFAULT 'continuous',\
      `values` text,\
      `minLabel` varchar(511) NOT NULL DEFAULT '0',\
      `maxLabel` varchar(511) NOT NULL DEFAULT '100',\
      `seqnr` int(11) NOT NULL DEFAULT '0',\
      `createdAt` datetime NOT NULL,\
      `updatedAt` datetime NOT NULL,\
      `deletedAt` datetime DEFAULT NULL\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
    CREATE TABLE `choicesGuideResults` (\
      `id` int(11) NOT NULL,\
      `choicesGuideId` int(11) NOT NULL,\
      `userId` int(11) DEFAULT NULL,\
      `userFingerprint` text,\
      `result` text NOT NULL,\
      `createdAt` datetime NOT NULL,\
      `updatedAt` datetime NOT NULL,\
      `deletedAt` datetime DEFAULT NULL\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
    CREATE TABLE `choicesGuides` (\
      `id` int(11) NOT NULL,\
      `siteId` int(11) NOT NULL,\
      `title` varchar(255) NOT NULL,\
      `description` text NOT NULL,\
      `images` text NOT NULL,\
      `createdAt` datetime NOT NULL,\
      `updatedAt` datetime NOT NULL,\
      `deletedAt` datetime DEFAULT NULL\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\
    ALTER TABLE `choicesGuideChoices`\
      ADD PRIMARY KEY (`id`);\
    ALTER TABLE `choicesGuideQuestionGroups`\
      ADD PRIMARY KEY (`id`),\
      ADD KEY `choicesGuideId` (`choicesGuideId`);\
    ALTER TABLE `choicesGuideQuestions`\
      ADD PRIMARY KEY (`id`),\
      ADD KEY `choicesGuideId` (`questionGroupId`);\
    ALTER TABLE `choicesGuideResults`\
      ADD PRIMARY KEY (`id`),\
      ADD KEY `choicesGroupId` (`choicesGuideId`);\
    ALTER TABLE `choicesGuides`\
      ADD PRIMARY KEY (`id`),\
      ADD KEY `siteId` (`siteId`);\
    ALTER TABLE `choicesGuideChoices`\
      MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
    ALTER TABLE `choicesGuideQuestionGroups`\
      MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
    ALTER TABLE `choicesGuideQuestions`\
      MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
    ALTER TABLE `choicesGuideResults`\
      MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
    ALTER TABLE `choicesGuides`\
      MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;\
    ALTER TABLE `choicesGuideQuestionGroups`\
      ADD CONSTRAINT `choicesGuideId` FOREIGN KEY (`choicesGuideId`) REFERENCES `choicesGuides` (`id`) ON DELETE CASCADE;\
    ALTER TABLE `choicesGuides`\
      ADD CONSTRAINT `siteId` FOREIGN KEY (`siteId`) REFERENCES `sites` (`id`) ON DELETE CASCADE;\
    ");
	},
	down: function() {
		return db.query("DROP TABLE `newslettersignups`;");
	}
}
