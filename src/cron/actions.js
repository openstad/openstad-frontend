var log           = require('debug')('app:cron');
var notifications = require('../notifications');
const db = require('../db');

// -------
// Run actions
//
module.exports = {
    cronTime: '*/5  * * * *',
    //cronTime: '*/10 * * * *',
    runOnInit: false,
    onTick: async () => {
        try {
            await db.Action.run();
        } catch (e) {
            console.log('Error in actions crons: ', e)
        }
    }
};
