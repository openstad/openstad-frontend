'use strict';
const db = require('../src/db').sequelize;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return db.query(`
      CREATE TABLE  IF NOT EXISTS \`tags\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`siteId\` int NOT NULL,
        \`name\` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
        \`extraData\` json DEFAULT NULL,
        \`createdAt\` datetime NOT NULL,
        \`updatedAt\` datetime NOT NULL,
        \`deletedAt\` datetime DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

      CREATE TABLE  IF NOT EXISTS \`ideaTags\` (
        \`createdAt\` datetime NOT NULL,
        \`updatedAt\` datetime NOT NULL,
        \`tagId\` int NOT NULL,
        \`ideaId\` int NOT NULL,
        PRIMARY KEY (\`tagId\`,\`ideaId\`),
        KEY \`ideaId\` (\`ideaId\`),
        CONSTRAINT \`ideatags_ibfk_1\` FOREIGN KEY (\`tagId\`) REFERENCES \`tags\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`ideatags_ibfk_2\` FOREIGN KEY (\`ideaId\`) REFERENCES \`ideas\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return db.query("DROP TABLE `tags`; DROP TABLE \`ideaTags\`");

  }
};
