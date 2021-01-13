const userClientApi = require('../services/userClientApi');
const config = require('config');

exports.withOne = (req, res, next) => {
  const authServerUrl = config.authorization['auth-server-url'];

  userClientApi
    .fetch(authServerUrl, req.params.clientId)
    .then((client) => {
      req.userApiClient = client;
      res.locals.userApiClient = req.client;
      next();
    })
    .catch((err) => {
      next(err);
    });
}

exports.withOneForSite = (req, res, next) => {
  const authServerUrl = config.authorization['auth-server-url'];

  const authClientIdDefault = req.site.config && req.site.config.oauth && req.site.config.oauth.default ? req.site.config.oauth.default["auth-client-id"]  : false;
  const authClientId  = authClientIdDefault ? authClientIdDefault : (req.site.config && req.site.config.oauth ? req.site.config.oauth["auth-client-id"] : false);
  const apiCredentials = {
      client_id:  process.env.USER_API_CLIENT_ID,
      client_secret: process.env.USER_API_CLIENT_SECRET,
  }
  userClientApi
    .fetch(authServerUrl, apiCredentials, authClientId)
    .then((client) => {
      req.userApiClient = client;
      res.locals.userApiClient = req.userApiClient;
      res.locals.userApiClient.requiredUserFields = res.locals.userApiClient.requiredUserFields ? res.locals.userApiClient.requiredUserFields : [];
      next();
    })
    .catch((err) => {
  //   console.log('==>> err', err);
      next();
    });
}

exports.withAllForSite = (req, res, next) => {
  req.siteOAuthClients = [];
  const site          = req.site;
  const authServerUrl = config.authorization['auth-server-url'];

  const oauthConfig   = req.site.config.oauth;

  let which = req.query.useOauth || 'default';
  let siteOauthConfig = (req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};
  let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
  let authClientSecret = siteOauthConfig['auth-client-secret'] || config.authorization['auth-client-secret'];

  const apiCredentials = {
      client_id:  authClientId,
      client_secret: authClientSecret,
  }

  const fetchActions = [];
  const fetchClient = (req, oauthClientId) => {
    return new Promise((resolve, reject) => {
      return userClientApi
        .fetch(authServerUrl,apiCredentials, oauthClientId)
        .then((client) => {
          req.siteOAuthClients.push(client);
          resolve();
        })
        .catch((err) => {
          console.log('==>> err oauthClientId', oauthClientId, err.message);
          resolve();
        });
    })
  }

  if (oauthConfig && Object.keys(oauthConfig).length > 0) {
    Object.keys(oauthConfig).forEach((configKey) => {
      let oauthClientId = oauthConfig[configKey]["auth-client-id"];
      fetchActions.push(fetchClient(req, oauthClientId));
    })
  } else {
    fetchActions.push(fetchClient(req, authClientId));
  }

  return Promise
          .all(fetchActions)
          .then(() => { next(); })
          .catch((e) => {
            console.log('eeee', e)
            next();
          });
}
