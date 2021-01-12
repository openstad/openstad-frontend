/**
 * Run through all sites and check if the DNS for the registered are pointed towards the servers
 * If not we give a warning in UI to USER
 * If yes and on kubernetes we create an automtic ingress (nginx) host file if not exits, (kubernetes will automatically )
 * If we would allow host files te exists that are not pointed to our server we will quickly run in to the rate limit of let's encrypt
 * for the kubernetes server
 * @type {[type]}
 */
const log = require('debug')('app:cron');
const checkHostStatus = require('../services/checkHostStatus')

// if you want te debug, easiest is to run it here
//checkHostStatus();

// Purpose
// -------
// Check periodically if the IP address is set to
module.exports = {
  cronTime: '0 2 */6 * * *',
  runOnInit: false,
  onTick: async () => {
    console.log('crons --- checking sites host status')
    checkHostStatus();
  }
};
