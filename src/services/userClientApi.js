const rp = require('request-promise');
const nestedObjectAssign = require('nested-object-assign');
const httpBuildQuery = require('../util/httpBuildQuery')



exports.fetch = (apiUrl, apiCredentials, clientId) => {
  return rp({
    method: 'GET',
    uri: `${apiUrl}/api/admin/client/${clientId}`,
    headers: {
        'Accept': 'application/json'
    },
    body: apiCredentials,
    json: true // Automatically parses the JSON string in the response
  })
//  .then(response => response.json());
}

exports.fetchAll = (apiUrl, apiCredentials, params) => {
  const query = params ? httpBuildQuery(params) : '';
  
  return rp({
    method: 'GET',
    uri: `${apiUrl}/api/admin/clients?${query}`,
    headers: {
        'Accept': 'application/json'
    },
    body: apiCredentials,
    json: true // Automatically parses the JSON string in the response
  })
//  .then(response => response.json());
};


exports.create = (apiUrl, data) => {
  let body = nestedObjectAssign(data, apiCredentials);

  return rp({
      method: 'POST',
      uri: `${apiUrl}/client`,
      headers: {
          'Accept': 'application/json'
      },
      body: body,
      json: true // Automatically parses the JSON string in the response
  });
}

exports.update = (apiUrl, clientId, data) => {
  return rp({
    method: 'POST',
    uri: `${apiUrl}/client/${clientId}`,
    headers: {
        'Accept': 'application/json',
    },
    body: nestedObjectAssign(data, apiCredentials),
    json: true // Automatically parses the JSON string in the response
  });
}

exports.delete = (apiUrl, clientId) => {
  return rp({
    method: 'POST',
    uri: `${apiUrl}/client/${clientId}/delete`,
    json: true, // Automatically parses the JSON string in the response
    body: apiCredentials,
  });
}
