const config = require('config');
const merge = require('merge');

let fields = [ 'id', 'firstName', 'lastName', 'email', 'phoneNumber', 'extraData', 'hashedPhoneNumber', 'streetName', 'houseNumber', 'city', 'suffix', 'postcode', 'password', 'resetPasswordToken', 'twoFactorToken', 'twoFactorConfigured', 'createdAt', 'updatedAt' ];

let OAuthUser = {};

// todo: config uitbreiden en mergen
// doc: niet recursief want daar kan ik geen use case voor bedenken

let parseConfig = function(siteConfig) {

  // default config
  let config = {
    bio: 'site-specific',
  };

  // merge with site config
  config = merge.recursive(config, siteConfig)

  return config;
  
}

let parseData = function(siteId, config, value) {

  let result;
  let siteDataFound = false;

  if (Array.isArray(value)) {

    value.forEach(elem => {

      if (typeof elem == 'object' && elem.value && elem.siteId) {
        siteDataFound = true;
        if (elem.siteId == siteId && config == 'site-specific') {
          result = elem.value
        }
      } else {
        if (!result) {
          result = elem;
        }
      }
    });

  }

  if (siteDataFound) {
    return result;
  } else {
    return value; // this is just an arrray
  }

}

OAuthUser.parseDataForSite = function(siteConfig, data) {

  let config = parseConfig(siteConfig);

  // extraData
  let extraData = data.extraData || {};
  data.extraData = {};
  Object.keys(extraData).forEach(key => {
    data.extraData[key] = parseData(config.id, config[key], extraData[key]);
  });

  return data;

}

let mergeData = function(siteId, config, userValue, dataValue) {

  if (config != 'site-specific') return dataValue;

  let result = userValue;

  if (!Array.isArray(result)) result = [result];
  let found, foundIndex;
  result.forEach(( elem, index ) => {
    if (typeof elem == 'object' && elem.value && elem.siteId && elem.siteId == siteId) {
      found = elem;
      foundIndex = index;
    }
  });

  if (found) {
    if (dataValue == null) {
      result.splice(foundIndex, 1);  // null means remove
    } else {
      found.value = dataValue;
    }
  } else {
    result.push({ siteId, value: dataValue })
  }

  return result;

}

OAuthUser.mergeDataForSite = function(siteConfig, user, data) {

  let config = parseConfig(siteConfig);

  // extraData
  let extraData = data.extraData || {};
  data.extraData = {};
  Object.keys(extraData).forEach(key => {
    data.extraData[key] = mergeData(config.id, config[key], user.extraData && user.extraData[key], extraData[key]);
  });

  user = merge.recursive(true, user, data);

  return user;

}

module.exports = exports = OAuthUser;
