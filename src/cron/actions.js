var log           = require('debug')('app:cron');
var notifications = require('../notifications');
const db = require('../db');

// Purpose
// -------
// Send notifications emails.
//
// Runs every 5 minutes on the 15th second, because the close_ideas
// cron already runs on the 0th second.
module.exports = {
    //cronTime: '*/5 * * * * *',
    cronTime: '*/10 * * * * *',
    runOnInit: false,
    onTick: async () => {
        try {
            await db.Action.run();
        } catch (e) {
            console.log('Error in actions crons: ', e)
        }
    }
};
