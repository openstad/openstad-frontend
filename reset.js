const config  = require('config');
process.env.DEBUG = config.logging;

const datafile = process.env.NODE_ENV || 'development';
const db = require('./src/db');

async function doReset() {

  try {

    console.log('Syncing...');

    await db.sequelize.sync({force: true})

    console.log('Adding default data...');
	  await require(`./fixtures/${datafile}`)(db);

  } catch (err) {
    console.log(err);
  } finally {
	  db.sequelize.close();
  }
  
}

doReset();
