const config = require('config');
const fetch = require('node-fetch');
const merge = require('merge');
const httpBuildQuery = require('../util/httpBuildQuery')

const formatOAuthApiCredentials = (siteConfig, which = 'default') => {
  let siteOauthConfig = (siteConfig && siteConfig.oauth && siteConfig.oauth[which]) || {};
  let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
  let authClientSecret = siteOauthConfig['auth-client-secret'] || config.authorization['auth-client-secret'];
  return 'Basic ' + new Buffer(`${authClientId}:${authClientSecret}`).toString('base64');
}

const formatOAuthApiUrl = (path, siteConfig, which = 'default') => {
  let siteOauthConfig = (siteConfig && siteConfig.oauth && siteConfig.oauth[which]) || {};
  let url = siteOauthConfig['auth-server-url'] || config.authorization['auth-server-url'];
  url += path;
  let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
  url = url.replace(/\{\{clientId\}\}/, authClientId);
  url += `?client_id=${authClientId}`;
  return url;
}

let OAuthAPI ={};

OAuthAPI.fetchClient = (siteConfig, clientId) => {

  const oauthServerUrl = formatOAuthApiUrl('/api/admin/client/{{clientId}}', siteConfig, 'default');
  const oauthServerCredentials = formatOAuthApiCredentials(siteConfig, 'default');

  return fetch(oauthServerUrl, {
	  headers: { "Authorization": oauthServerCredentials, "Content-type": "application/json" },
  })
	  .then((response) => {
		  if (!response.ok) throw Error(response)
		  return response.json();
	  })
	  .catch((err) => {
		  console.log('Niet goed');
		  console.log(err);
	  });

}

OAuthAPI.fetchAll = (apiUrl, siteConfig, params) => {

  throw Error('not yet implemented')

  //	const query = params ? httpBuildQuery(params) : '';
  //	
  //	return rp({
  //		method: 'GET',
  //		uri: `${apiUrl}/api/admin/clients?${query}`,
  //		headers: {
  //				'Accept': 'application/json'
  //		},
  //		body: apiCredentials,
  //		json: true // Automatically parses the JSON string in the response
  //	})
  // //	.then(response => response.json());

};


OAuthAPI.create = (apiUrl, data) => {

  throw Error('not yet implemented')

  // let body = merge.recursive(data, apiCredentials);
  // return rp({
  //		 method: 'POST',
  //		 uri: `${apiUrl}/client`,
  //		 headers: {
  //				 'Accept': 'application/json'
  //		 },
  //		 body: body,
  //		 json: true // Automatically parses the JSON string in the response
  // });
}

OAuthAPI.update = (apiUrl, clientId, data) => {

  throw Error('not yet implemented')

  // return rp({
  //	 method: 'POST',
  //	 uri: `${apiUrl}/client/${clientId}`,
  //	 headers: {
  //			 'Accept': 'application/json',
  //	 },
  //	 body: merge.recursive(data, apiCredentials),
  //	 json: true // Automatically parses the JSON string in the response
  // });
}

OAuthAPI.delete = (apiUrl, clientId) => {

  throw Error('not yet implemented')

  // return rp({
  //   method: 'POST',
  //   uri: `${apiUrl}/client/${clientId}/delete`,
  //   json: true, // Automatically parses the JSON string in the response
  //   body: apiCredentials,
  // });
}

module.exports = exports = OAuthAPI;
