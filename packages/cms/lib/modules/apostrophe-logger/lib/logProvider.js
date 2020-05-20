const config = require('./config');

function LogProvider(name) {
  this.name = name;

  if(!config[name]) {
    throw new Error('Logging provider config does not exist');
  }
  
  const providerConfig = config[name];
  if(!providerConfig.key || !providerConfig.url) {
    console.error('Apostrophe logger module: providerConfig invalid', providerConfig);
    throw new Error('Provider config not valid, config must have a key and url property');
  }

  this.getUrl = () => {
    return providerConfig.url;
  };

  this.getKey = () => {
    return providerConfig.key;
  };
}

module.exports = {
  LogProvider
};
