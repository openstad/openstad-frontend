'use strict';
const db = require('../src/db').sequelize;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return db.query(`
      CREATE TABLE \`areas\` (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) NOT NULL,
      \`polygon\` geometry NOT NULL,
      \`createdAt\` datetime NOT NULL,
      \`updatedAt\` datetime NOT NULL,
      \`deletedAt\` datetime DEFAULT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    ALTER TABLE \`sites\`
      ADD \`areaId\` int(11) DEFAULT NULL AFTER \`config\`,
      ADD KEY \`areaId\` (\`areaId\`),
      ADD CONSTRAINT \`site_area\` FOREIGN KEY (\`areaId\`) REFERENCES \`areas\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return db.query("ALTER TABLE `sites` DROP CONSTRAINT `site_area`, DROP KEY `areaId`, DROP `areaId`; DROP TABLE IF EXISTS `areas`;");
  }
};
