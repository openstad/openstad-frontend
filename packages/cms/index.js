require('dotenv').config();
const _ = require('lodash');
const { readdirSync } = require('fs');
const openstadApp = require('./app');

module.exports.getDefaultConfig = (options) => {
  return openstadApp.getDefaultConfig(options);
};

module.exports.getSingleApp = () => {
  return openstadApp.getApostropheApp();
};

module.exports.site = (options) => {

  const app = openstadApp.getMultiSiteApp(options);
  app.listen(process.env.PORT);

};

const getDirectories = source => readdirSync(source).filter(name => name.indexOf('apostrophe') <= -1);

module.exports.moogBundle = {
  modules: getDirectories(__dirname + '/lib/modules'),
  views: getDirectories(__dirname + '/views'),
  directory: 'lib/modules'
};
