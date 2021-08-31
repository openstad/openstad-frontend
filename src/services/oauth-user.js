const config = require('config');
const merge = require('merge');

let OAuthUser = {};

// these fields exist in the API but not in the oath server
let apiFieldsInExtraData = [ 'listableByRole', 'detailsViewableByRole', 'nickName', 'gender', 'signedUpForNewsletter' ];

// todo: config uitbreiden en mergen
// doc: niet recursief want daar kan ik geen use case voor bedenken

let parseConfig = function(siteConfig) {

  // default config
  let config = {
    bio: { sitespecific: true },
    expertise: { sitespecific: true },
  };

  // these fields exist in the API but not in the oath server and are therefore site specific
  apiFieldsInExtraData.forEach(key => {
    config[key] = { sitespecific: true };
  });

  // merge with site config
  if (siteConfig && siteConfig.users && siteConfig.users.extraData) {
    config = merge.recursive(config, siteConfig.users.extraData)
  }

  config.id = siteConfig ? siteConfig.id : '';

  return config;
  
}

let parseData = function(siteId, config, value) {

  let result;
  let siteDataFound = false;

  if (Array.isArray(value)) {

    value.forEach(elem => {

      if (typeof elem == 'object' && elem != null && elem.value && elem.siteId) {
        siteDataFound = true;
        if (elem.siteId == siteId && config && config.sitespecific ) {
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
  let cloned = merge(true, data.extraData) || {};
  let extraData = {};
  Object.keys(cloned).forEach(key => {
    extraData[key] = parseData(config.id, config[key], cloned[key]);
  });

  // split api fields
  apiFieldsInExtraData.forEach(key => {
    data[key] = extraData[key];
    delete extraData[key];
  });
  
  data.extraData = extraData;

  return data;

}

let mergeData = function(siteId, config, userValue, dataValue) {

  if (!(config && config.sitespecific)) return dataValue;

  let result = userValue;

  if (!Array.isArray(result)) result = [result];
  let found, foundIndex;
  result.forEach(( elem, index ) => {
    if (typeof elem == 'object' && elem != null && elem.value && elem.siteId && elem.siteId == siteId) {
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

  // api fields
  apiFieldsInExtraData.forEach(key => {
    if (typeof data[key] != 'undefined') {
      data.extraData[key] = mergeData(config.id, config[key], user.extraData && user.extraData[key], data[key]);
    }
    delete data[key];
  });

  user = merge.recursive(true, user, data);
  return user;

}

module.exports = exports = OAuthUser;
