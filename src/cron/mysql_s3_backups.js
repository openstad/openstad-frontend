const AWS = require('aws-sdk');
const fs = require('fs'); // Needed for example below
const mysqldump = require('mysqldump');
const moment = require('moment')


var Promise = require('bluebird');

var log     = require('debug')('app:cron');
var db      = require('../db');

// Purpose
// -------
// Auto-close ideas that passed the deadline.
//
// Runs every night at 1:00.
const backupMysqlToS3 = async () => {
  const dbsToBackup = process.env.S3_DBS_TO_BACKUP ? process.env.S3_DBS_TO_BACKUP.split(',') : false;

  if (dbsToBackup) {
    dbsToBackup.forEach(async function(dbName) {
      // return the dump from the function and not to a file

      const result = await mysqldump({
          connection: {
              host: process.env.API_DATABASE_HOST,
              user: process.env.API_DATABASE_USER,
              password: process.env.API_DATABASE_PASSWORD,
              database: dbName.trim(),
          },
      });


      const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);

      const created = moment().format('YYYY-MM-DD hh:mm:ss')

      const s3 = new AWS.S3({
          endpoint: spacesEndpoint,
          accessKeyId: process.env.S3_KEY,
          secretAccessKey: process.env.S3_SECRET
      });

      var params = {
          Bucket: process.env.S3_BUCKET,
          Key: 'mysql/' + dbName + '_' + created + ".sql",
          Body: result.dump.data,
          ACL: "private"
      };

      s3.putObject(params, function(err, data) {
          if (err) console.log(err, err.stack);
          else     console.log(data);
      });

    });

  }
}


/*
  ENV values needed:

  API_DATABASE_HOST
  API_DATABASE_USER
  API_DATABASE_PASSWORD
  S3_DBS_TO_BACKUP
  S3_ENDPOINT
  S3_KEY
  S3_SECRET
  S3_MYSQL_BUCKET
 */

module.exports = {
	cronTime: '0 0 1 * * *',
	runOnInit: false,
	onTick: async function() {
    backupMysqlToS3();
	}
};
