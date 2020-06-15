require('dotenv').config();
const _ = require('lodash');
const { readdirSync } = require('fs');

module.exports.site = (options) => {

  const multiSite = require('./app.js');

  const app = multiSite.getMultiSiteApp(options);
  app.listen(process.env.PORT);

};

const getDirectories = source => readdirSync(source).filter(name => name.indexOf('apostrophe') <= -1);

module.exports.moogBundle = {
  modules: getDirectories(__dirname + '/lib/modules'),
  directory: 'lib/modules'
};
