const AWS = require('aws-sdk');
const fs = require('fs'); // Needed for example below
const moment = require('moment')
const os = require('os');
//const BACKUP_PATH = (ZIP_NAME) => path.resolve(os.tmpdir(), ZIP_NAME);
const { exec } = require('child_process');

var Promise = require('bluebird');

var log     = require('debug')('app:cron');
var db      = require('../db');

// Purpose
// -------
// Auto-close ideas that passed the deadline.
//          accessKeyId: process.env.S3_KEY,
          secretAccessKey: process.env.S3_SECRET
// Runs every night at 1:00.
//
function currentTime(timezoneOffset) {
    if (timezoneOffset) {
        return moment(moment(moment.now()).utcOffset(timezoneOffset, true).toDate()).format("YYYY-MM-DDTHH-mm-ss");
    } else {
        return moment
            .utc()
            .format('YYYY-MM-DDTHH-mm-ss');
    }
}

const backupMongoDBToS3 = async () => {
    if (process.env.S3_MONGO_BACKUPS === 'ON') {
      const host = process.env.MONGO_DB_HOST || 'localhost';
      const port = process.env.MONGO_DB_PORT || 27017;
      const tmpDbFile = 'db_mongo'

    //  let DB_BACKUP_NAME = `mongodb_${currentTime()}.gz`;

      // Default command, does not considers username or password
      let command = `mongodump -h ${host} --port=${port} --archive=${tmpDbFile}`;

      // When Username and password is provided
      // /
      //if (username && password) {
      //    command = `mongodump -h ${host} --port=${port} -d ${database} -p ${password} -u ${username} --quiet --gzip --archive=${BACKUP_PATH(DB_BACKUP_NAME)}`;
      //}

      exec(command, (err, stdout, stderr) => {
          if (err) {
              // Most likely, mongodump isn't installed or isn't accessible
            console.log('errere', err);
          } else {
            const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);

            const created = moment().format('YYYY-MM-DD hh:mm:ss')
            const fileContent = fs.readFileSync(tmpDbFile);

            const s3 = new AWS.S3({
                endpoint: spacesEndpoint,
                accessKeyId: process.env.S3_KEY,
                secretAccessKey: process.env.S3_SECRET
            });

            var params = {
                Bucket: process.env.S3_BUCKET,
                Key: "mongodb/mongo_" + created,
                Body: fileContent,
                ACL: "private"
            };

            s3.putObject(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else     console.log(data);
            });
          }
      });
    }
}


/*
  ENV values needed:

  MONGO_DB_HOST
  S3_DBS_TO_BACKUP
  S3_ENDPOINT
  S3_KEY
  S3_SECRET
  S3_MYSQL_BUCKET
 */

module.exports = {
	cronTime: '0 0 1 * * *',
	runOnInit: true,
	onTick: async function() {
    backupMongoDBToS3();
	}
};
