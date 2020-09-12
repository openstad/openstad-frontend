const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const host = process.env.MONGO_DB_HOST || 'localhost';
const port = 27017;
const MongoServer = new mongodb.Server(host, port);
const url = 'mongodb://' + host + ':' + port;

exports.copyMongoDb = (oldDbName, newDbName) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        reject(err);
      } else {
        var mongoCommand = {
          copydb: 1,
          fromhost: "localhost",
          fromdb: oldDbName,
          todb: newDbName
        };
        var admin = db.admin();

        admin.command(mongoCommand, function(commandErr, data) {
          if (!commandErr) {
            resolve(data)
          } else {
            reject(commandErr.errmsg);
          }
          db.close();
        });
      }
    });
  });
}

exports.dbExists = (dbName) => {

  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        reject(err);
      } else {
        var adminDb = db.admin();

        // List all the available databases
        adminDb.listDatabases(function(err, dbs) {
          const found = dbs.databases.find((dbObject) => {
            return dbName === dbObject.name;
          });

          db.close();
          resolve(!!found)
        });
      }
    });
  });
}

exports.deleteDb = (dbName) => {

  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        reject(err);
      } else {
        var adminDb = db.admin();

        new mongodb.Db(dbName, MongoServer, {}).open(function (error, client) {
          console.log('---> err', error);
            if(error) callback(error);
            // drop the database
            client.dropDatabase(function(err, result) {
                if(err) callback(err);
                client.close();
            });
        });

        db.close();
        resolve();
      }
    });
  });
}
