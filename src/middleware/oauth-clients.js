// deze wordt momenteel alleen gebruikt in de update site route, en dan alleen withAllForSite

const config = require('config');
const OAuthApi = require('../services/oauth-api');

exports.withOne = (req, res, next) => {
  throw Error('not implemented')
  //  const authServerUrl = config.authorization['auth-server-url'];
  // 
  //  OAuthApi
  //    .fetch(authServerUrl, req.params.clientId)
  //    .then((client) => {
  //      req.userApiClient = client;
  //      res.locals.userApiClient = req.client;
  //      next();
  //    })
  //    .catch((err) => {
  //      next(err);
  //    });
}

exports.withOneForSite = (req, res, next) => {
  throw Error('not implemented')
  // const authServerUrl = config.authorization['auth-server-url'];
  //
  // const authClientIdDefault = req.site.config && req.site.config.oauth && req.site.config.oauth.default ? req.site.config.oauth.default["auth-client-id"]  : false;
  // const authClientId  = authClientIdDefault ? authClientIdDefault : (req.site.config && req.site.config.oauth ? req.site.config.oauth["auth-client-id"] : false);
  // const apiCredentials = {
  //     client_id:  process.env.USER_API_CLIENT_ID,
  //     client_secret: process.env.USER_API_CLIENT_SECRET,
  // }
  // userClientApi
  //   .fetch(authServerUrl, apiCredentials, authClientId)
  //   .then((client) => {
  //     req.userApiClient = client;
  //     res.locals.userApiClient = req.userApiClient;
  //     res.locals.userApiClient.requiredUserFields = res.locals.userApiClient.requiredUserFields ? res.locals.userApiClient.requiredUserFields : [];
  //     next();
  //   })
  //   .catch((err) => {
  // //   console.log('==>> err', err);
  //     next();
  //   });
}

exports.withAllForSite = (req, res, next) => {

  req.siteOAuthClients = [];
  const site          = req.site;
  const authServerUrl = config.authorization['auth-server-url'];

  const siteConfig = req.site && req.site.config
  const oauthConfig  = siteConfig.oauth;
  
  const fetchActions = [];
  const fetchClient = (req, which) => {
    return new Promise((resolve, reject) => {
      return OAuthApi
        .fetchClient({ siteConfig, which })
        .then((client) => {
          if (client && client.id) req.siteOAuthClients.push(client);
          resolve();
        })
        .catch((err) => {
          console.log('==>> err oauthClientId', which, err.message);
          resolve();
        });
    })
  }

  if (oauthConfig && Object.keys(oauthConfig).length > 0) {
    Object.keys(oauthConfig).forEach((configKey) => {
      fetchActions.push(fetchClient(req, configKey));
    })
  } else {
    let which = req.query.useOauth || 'default';
    fetchActions.push(fetchClient(req, which));
  }

  return Promise
          .all(fetchActions)
          .then(() => { next(); })
          .catch((e) => {
            console.log('eeee', e)
            next();
          });
}
