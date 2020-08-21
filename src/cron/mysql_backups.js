var Promise = require('bluebird');

var log     = require('debug')('app:cron');
var db      = require('../db');

// Purpose
// -------
// Auto-close ideas that passed the deadline.
//
// Runs every night at 1:00.
module.exports = {
	cronTime: '0 0 1 * * *',
	runOnInit: true,
	onTick: function() {
    const mysqlRootPw = process.env.MYSQL_ROOT_PASS;
    const objectStoreUrl = process.env.OBJECT_STORE_URL;
    const objectStoreUser = process.env.OBJECT_STORE_USER;
    const objectStorePass = process.env.OBJECT_STORE_PASS;

    if (mysqlRootPw && objectStoreUrl && objectStoreUser && objectStorePass) {
      const { exec } = require('child_process');
      exec(`perl mongodb_backups root ${mysqlRootPw} ${objectStoreUrl} ${objectStoreUser} ${objectStorePass}`, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          // node couldn't execute the command, should send emails for backups
          console.log('err backups mongo', err)
          return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
    }
	}
};
