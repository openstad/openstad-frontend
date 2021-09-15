const moment = require('moment');
const { Sequelize, Op } = require('sequelize');
const log = require('debug')('app:cron');
const db	= require('../db');

// Purpose
// -------
// Auto-close ideas that passed the deadline.
// 
// Runs every hour
module.exports = {
	cronTime: '0 0 */1 * * *',
	// cronTime: '*/5 * * * * *',
	runOnInit: false,
	onTick: async function() {

    try {

      let sites = await db.Site.findAll({
        where: Sequelize.where(Sequelize.fn('JSON_VALUE', Sequelize.col('config'), '$.ideas.automaticallyUpdateStatus.isActive'), true)
      });

      for ( let site of sites ) {

        let days = site.config.ideas.automaticallyUpdateStatus.afterXDays || 90;
        let ideas = await db.Idea.findAll({
          where: {
            siteId: site.id,
            startDate: { [Op.lte]: moment().subtract(days, 'days').toDate() },
   			    status: 'OPEN'
          }
        });

        for ( let idea of ideas ) {
          let result = await idea.setStatus('CLOSED');
          log('Automatically closed idea %d', idea.id);
        }

      }

    } catch(err) {
      console.log('CRON automatically update status FAILED');
      console.log(err);
    }

	}
};
