const config = require('config');
const jwt = require('jsonwebtoken');
const merge = require('merge');
const fetch = require('node-fetch');
const db = require('../db');
const OAuthApi = require('../services/oauth-api');

/**
 * Get user from jwt or fixed token and validate with auth server
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async function getUser( req, res, next ) {
  try {

    if (!req.headers['x-authorization']) {
      return nextWithEmptyUser(req, res, next);
    }

    const userId = getUserId(req.headers['x-authorization']);

    const which = req.query.useOauth || 'default';
    let siteConfig = req.site && merge({}, req.site.config, { id: req.site.id });

    if(userId === null) {
      return nextWithEmptyUser(req, res, next);
    }

    const userEntity = await getUserInstance({ siteConfig, which, userId });
    req.user = userEntity
    // Pass user entity to template view.
    res.locals.user = userEntity;
    next();
  } catch(error) {
    console.error(error);
    next(error);
  }
}

/**
 * Continue with empty user if user is not set
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function nextWithEmptyUser(req, res, next) {
  req.user = {};
  res.locals.user = {};

  return next();
}

/**
 * UserId constructor function to set the userId and the flag fixed to indicate if this userId is an fixedToken or not.
 * @param id
 * @param fixed
 * @constructor
 */
function UserId(id, fixed) {
  this.id = id;
  this.fixed = fixed;
}

function getUserId(authorizationHeader) {
  const tokens = config && config.authorization && config.authorization['fixed-auth-tokens'];

  if (authorizationHeader.match(/^bearer /i)) {
    const jwt = parseJwt(authorizationHeader);
    return (jwt && jwt.userId) ? new UserId(jwt.userId, false) : null;
  }
  if (tokens) {
    const token = tokens.find(token => token.token === authorizationHeader);
    if (token) {
      return new UserId(token.userId, true);
    }
  }

  return null;
}

/**
 * get token from authorization header and parse jwt.
 * @param authorizationHeader
 * @returns {*}
 */
function parseJwt(authorizationHeader) {
  let token = authorizationHeader.replace(/^bearer /i, '');
  return jwt.verify(token, config.authorization['jwt-secret']);
}

/**
 * Get user from api database and auth server and combine to one user object.
 * @param user
 * @param siteConfig
 * @returns {Promise<{}|{externalUserId}|*>}
 */
async function getUserInstance({ siteConfig, which = 'default', userId }) {

  let dbUser;
  
  try {

    dbUser = await db.User.findByPk(userId.id);

    if (!dbUser || !dbUser.externalUserId || !dbUser.externalAccessToken) {
      return userId.fixed ? dbUser : {};
    }

  } catch(error) {
    console.log(error);
    throw error;
  }

  try {

    let oauthUser = await OAuthApi.fetchUser({ siteConfig, which, token: dbUser.externalAccessToken });

    let mergedUser = merge(dbUser, oauthUser);
    mergedUser.role = mergedUser.role || ((mergedUser.email || mergedUser.phoneNumber || mergedUser.hashedPhoneNumber) ? 'member' : 'anonymous');
    
    return mergedUser;

  } catch(error) {
    return await resetUserToken(dbUser);
  }

}

/**
 * Resets external access token in the api database if user exists.
 * This token is used to authorize with the auth server
 * @param user
 * @returns {Promise<{}>}
 */
async function resetUserToken(user) {
  if (!( user && user.update )) return {};
  await user.update({
    externalAccessToken: null
  });

  return {};
}
