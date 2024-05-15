const { MongoClient, ServerApiVersion } = require('mongodb');

function getConnectionString (database) {
  // Allow the connection string builder to be overridden by an environment variable
  // We replace '{database}' in this connection string with the database we are looking for
  if (process.env.MONGO_DB_CONNECTION_STRING) {
    return process.env.MONGO_DB_CONNECTION_STRING.replace('{database}', database);
  }
  
  const host = process.env.MONGO_DB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT_27017_TCP_PORT || process.env.MONGO_DB_PORT || 27017;
  const user = process.env.MONGO_DB_USER || '';
  const password = process.env.MONGO_DB_PASSWORD || '';
  const authSource = process.env.MONGO_DB_AUTHSOURCE || '';
  
  const useAuth = user && password;
  
  return `mongodb://${useAuth ? `${user}:${password}@` : ''}${host}:${port}/${database ? database : ''}${authSource ? `?authSource=${authSource}` : ''}`;
}

exports.getConnectionString = getConnectionString;

exports.copyMongoDb = (oldDbName, newDbName) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(getConnectionString(), function(err, db) {
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

exports.dbExists = async (dbName) => {
  return async (resolve, reject) => {
    try {
      const mongoClient = new MongoClient(getConnectionString(), {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true
        }
      })
      await mongoClient.connect((err, client) => {
        if (err) {
          reject(err);
        } else {
          var adminDb = client.db().admin();
          // List all the available databases
          adminDb.listDatabases(function(err, dbs) {
            const found = dbs.databases.find(dbObject => dbName === dbObject.name);
            client.close();
            resolve(!!found)
          });
        }
      });
    } catch (err) {
      console.log(`==> Error afgevangen: ${err}`)
    }
  };
}
