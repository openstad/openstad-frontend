const Promise = require('bluebird');
const Sequelize = require('sequelize');
const express = require('express');
const createError = require('http-errors');
const config = require('config');
const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const {Op} = require('sequelize');
const searchResults = require('../../middleware/search-results-user');
const fetch = require('node-fetch');
const merge = require('merge');
const OAuthApi = require('../../services/oauth-api');
const OAuthUser = require('../../services/oauth-user');

const filterBody = (req, res, next) => {
  const data = {};
  const keys = ['firstName', 'lastName', 'email', 'phoneNumber', 'streetName', 'houseNumber', 'city', 'suffix', 'postcode', 'extraData', 'listableByRole', 'detailsViewableByRole'];

  keys.forEach((key) => {
    if (req.body[key]) {
      data[key] = req.body[key];
    }
  });

  req.body = data;

  next();
}

const router = express.Router({mergeParams: true});

router
  .all('*', function (req, res, next) {
    req.scope = ['includeSite'];
    next();
  });


router.route('/')
// list users
// ----------
// .get(auth.can('User', 'list')) -> now handled by onlyListable
  .get(function (req, res, next) {
    req.scope.push({method: ['onlyListable', req.user.id, req.user.role]});
    next();
  })
  .get(pagination.init)
  .get(function (req, res, next) {
    let {dbQuery} = req;

    if (!dbQuery.where) {
      dbQuery.where = {};
    }

    if (dbQuery.where.q) {
      dbQuery.search = {
        haystack: ['role', 'firstName', 'lastName'],
        needle: dbQuery.where.q,
        offset: dbQuery.offset,
        limit: dbQuery.limit,
        pageSize: dbQuery.pageSize,
      };

      delete dbQuery.where.q;
      delete dbQuery.offset;
      delete dbQuery.limit;
      delete dbQuery.pageSize;
    }

    /**
     * Add siteId to query conditions
     * @type {{siteId: *}}
     */
    const queryConditions = Object.assign(dbQuery.where, {siteId: req.params.siteId});

    db.User
      .scope(...req.scope)
      .findAndCountAll({
        ...dbQuery,
        where: queryConditions,
      })
      .then(function (result) {
        req.results = result.rows;
        req.dbQuery.count = result.count;
        return next();
      })
      .catch(next);
  })
  .get(auth.useReqUser)
  .get(searchResults)
  .get(pagination.paginateResults)
  .get(function (req, res, next) {
    res.json(req.results);
  })

// create user
// -----------
  .post(auth.can('User', 'create'))
  .post(function (req, res, next) {
    if (!req.site) return next(createError(401, 'Site niet gevonden'));
    return next();
  })
  .post(function (req, res, next) {
    if (!(req.site.config && req.site.config.users && req.site.config.users.canCreateNewUsers)) return next(createError(401, 'Gebruikers mogen niet aangemaakt worden'));
    return next();
  })
  .post(filterBody)
  .post(function (req, res, next) {
    // Look for an Openstad user with this e-mail
    // TODO: other types of users
    if (!req.body.email) return next(createError(401, 'E-mail is a required field'));
    let which = req.query.useOauth || 'default';
    let siteConfig = req.site && merge({}, req.site.config, { id: req.site.id });
    let email = req.body && req.body.email;
    OAuthApi
      .fetchUser({ siteConfig, which, email })
      .then(json => {
        req.oAuthUser = json;
        next();
      })
      .catch(next);
  })
/**
 * In case a user exists for that e-mail in the oAuth api move on, otherwise create it
 * then create it
 */
  .post(function (req, res, next) {
    if (req.oAuthUser) {
      next();
    } else {
      // in case no oauth user is found with this e-mail create it
      let which = req.query.useOauth || 'default';
      let siteConfig = req.site && req.site.config;
      let userData = Object.assign(req.body);
      OAuthApi
        .createUser({ siteConfig, which, userData })
        .then(json => {
          req.oAuthUser = json;
          next()
        })
        .catch(next);
    }
  })
// check if user not already exists in API
  .post(function (req, res, next) {
    db.User
      .scope(...req.scope)
      .findOne({
        where: {email: req.body.email, siteId: req.params.siteId},
      })
      .then(found => {
        if (found) {
          throw new Error('User already exists');
        } else {
          next();
        }
      })
      .catch(next);
  })
  .post(function (req, res, next) {
    const data = {
      ...req.body,
      siteId: req.site.id,
      role: req.oAuthUser.role || 'member',
      externalUserId: req.oAuthUser.id
    };
    db.User
      .authorizeData(data, 'create', req.user)
      .create(data)
      .then(result => {
        return res.json(result);
      })
      .catch(function (error) {
        // todo: dit komt uit de oude routes; maak het generieker
        if (typeof error == 'object' && error instanceof Sequelize.ValidationError) {
          let errors = [];

          error.errors.forEach(function (error) {
            errors.push(error.message);
          });

          res.status(422).json(errors);
        } else {
          next(error);
        }
      });
  });

// anonymize user
// --------------
router.route('/:userId(\\d+)/:willOrDo(will|do)-anonymize(:all(all)?)')
  .put(function (req, res, next) {
    // this user
    req.userId = parseInt(req.params.userId);
    if (!req.userId) return next(new createError('404', 'User not found'))
    return db.User
      .scope(...req.scope)
      .findOne({
        where: {id: req.userId, siteId: req.params.siteId},
        //where: { id: userId }
      })
      .then(found => {
        if (!found) throw new Error('User not found');
        req.targetUser = found;
        req.externalUserId= found.externalUserId;
        next();
        return null;
      })
      .catch(next);
  })
  .put(function (req, res, next) {
    if (!req.externalUserId) return next();
    // this user on other sites
    let where = { externalUserId: req.externalUserId, [Op.not]: { id: req.userId } };
    db.User
      .scope(...req.scope)
      .findAll({
        where,
      })
      .then(found => {
        if (!found) return next();
        req.linkedUsers = found;
        next();
        return null;
      })
      .catch(next);
  })
  .put(async function (req, res, next) {
    // if body contains user ids then anonimize only those
    try {
      let ids = req.body && req.body.onlyUserIds;
      if (!ids) return next();
      if (!Array.isArray(ids)) ids = [ids];
      ids = ids.map(id => parseInt(id)).filter(id => typeof id == 'number');
      if (ids.length) req.onlyIds = ids;
    } catch (err) {
      return next(err);
    }
    return next();
  })
  .put(async function (req, res, next) {
    let result;
    if (!(req.targetUser && req.targetUser.can && req.targetUser.can('update', req.user))) return next(new Error('You cannot update this User'));
    if (req.onlyIds && !req.onlyIds.includes(req.targetUser.id)) {
      req.results = {
        "ideas": [],
        "articles": [],
        "arguments": [],
        "votes": [],
        "users": [],
        "sites": [],
      }
      return next();
    }
    try {
      if (req.params.willOrDo == 'do') {
        result = await req.targetUser.doAnonymize();
      } else {
        result = await req.targetUser.willAnonymize();
      }
      result.users = [ result.user ];
      delete result.user;
      result.sites = [ result.site ];
      delete result.site;
      req.results = result;
    } catch (err) {
      return next(err);
    }
    return next();
  })
  .put(async function (req, res, next) {
    if ( !(req.params.all) ) return next();
    if ( !(req.linkedUsers) ) return next();
    try {
      for (const user of req.linkedUsers) {
        if (!req.onlyIds ||req.onlyIds.includes(user.id)) {
          let result;
          if (!(user && user.can && user.can('update', req.user))) return next(new Error('You cannot update this User'));
          if (req.params.willOrDo == 'do') {
            result = await user.doAnonymize();
          } else {
            result = await user.willAnonymize();
          }
          req.results.users.push(result.user);
          req.results.sites.push(result.site);
          req.results.ideas = req.results.ideas.concat(result.ideas || []);
          req.results.articles = req.results.articles.concat(result.articles || []);
          req.results.arguments = req.results.arguments.concat(result.arguments || []);
          req.results.votes = req.results.votes.concat(result.votes || []);
        }
      }
    } catch (err) {
      return next(err);
    }
    return next();
  })
  .put(function (req, res, next) {
    if (!req.externalUserId) return next();
    // refresh: this user including other sites
    let where = { externalUserId: req.externalUserId };
    db.User
      .scope(...req.scope)
      .findAll({
        where,
      })
      .then(found => {
        if (!found) return next();
        req.remainingUsers = found;
        next();
        return null;
      })
      .catch(next);
  })
  .put(async function (req, res, next) {
    if (req.params.willOrDo != 'do') return next();
    if ( !req.remainingUsers || req.remainingUsers.length > 0 ) return next();

    // no api users left for this oauth user, so remove the oauth user
    let which = req.query.useOauth || 'default';
    let siteConfig = req.site && merge({}, req.site.config, { id: req.site.id });
    try {
      let result = await OAuthApi.deleteUser({ siteConfig, which, userData: { id: req.externalUserId }})
    } catch (err) {
      return next(err);
    }
    return next();
  })
  .put(function (req, res, next) {
    // customized version of auth.useReqUser
    Object.keys(req.results).forEach(which => {
      req.results[which] && req.results[which].forEach( result => {
        result.auth = result.auth || {};
        result.auth.user = req.user;
      });
    });
    return next();
  })
  .put(function (req, res, next) {
    res.json(req.results);
  })

// one user
// --------
router.route('/:userId(\\d+)')
  .all(function (req, res, next) {
    const userId = parseInt(req.params.userId) || 1;
    db.User
      .scope(...req.scope)
      .findOne({
        where: {id: userId, siteId: req.params.siteId},
        //where: { id: userId }
      })
      .then(found => {
        if (!found) throw new Error('User not found');
        req.results = found;
        next();
      })
      .catch(next);
  })

// view user
// ---------
  .get(auth.can('User', 'view'))
  .get(auth.useReqUser)
  .get(function (req, res, next) {
    res.json(req.results);
  })

// update user
// -----------
// TODO: hier zit de suggestie in dat je al je users op anders sites ook mag updaten. Maar dan toch niet, want dat geeft errors.
// Dus neem een besluit, maar dat expliciet, en zorg dan dat het gaat werken.
// -----------
  .put(auth.useReqUser)
  .put(filterBody)
  .put(function (req, res, next) {

    const user = req.results;

    if (!(user && user.can && user.can('update'))) return next(new Error('You cannot update this User'));

    let userId = parseInt(req.params.userId, 10);
    let externalUserId = req.results.externalUserId;

    let userData = merge.recursive(true, req.body);

    /**
     * Update the oauth API first
     */
    let which = req.query.useOauth || 'default';
    let siteConfig = req.site && merge({}, req.site.config, { id: req.site.id });
    OAuthApi
      .updateUser({ siteConfig, which, userData: merge(true, userData, { id: externalUserId }) })
      .then(json => {
        let mergedUserData = json;

        return db.User
          .scope(['includeSite'])
          .findAll({
            where: {
              externalUserId: mergedUserData.id,
              // old users have no siteId, this will break the update
              // skip them
              // probably should clean up these users
              siteId: {
                [Op.not]: 0
              }
            }
          })
          .then(function (users) {
            const actions = [];

            // dit gaat mis omdat hij het per site doet maar het resultaat al is geparsed voor deze site
            
            if (users) {
              users.forEach((user) => {
                // only update users with active site (they can be deleteds)
                if (user.site) {
                  actions.push(function () {
                    return new Promise((resolve, reject) => {

                      let userSiteConfig = merge(true, user.site.config, {id: user.site.id});
                      let clonedUserData = merge(true, mergedUserData);
                      let siteUserData = OAuthUser.parseDataForSite(userSiteConfig, clonedUserData);

                      user
                        .authorizeData(siteUserData, 'update', req.user)
                        .update(siteUserData)
                        .then((result) => {
                          resolve();
                        })
                        .catch((err) => {
                          console.log('err', err)
                          reject(err);
                        })
                    })
                  }())
                }

              });
            }

            return Promise.all(actions)
            // response has been sent; next has no meaning here
            // .then(() => { next(); })
              .catch(err => {
                console.log(err);
                throw(err)
              });

          })
          .catch(err => {
            console.log(err);
            throw(err)
          });
      })
      .then((result) => {
        return db.User
          .scope(['includeSite']) // TODO: waarom includeSite? Kan dat weg?
          .findOne({
            where: {id: userId, siteId: req.params.siteId}
          })
      })
      .then(found => {
        if (!found) throw new Error('User not found');
        let result = found.toJSON();
        delete result.site;
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
  })

// delete user
// -----------
  .delete(auth.useReqUser)
  .delete(async function (req, res, next) {

    const user = req.results;

    if (!(user && user.can && user.can('delete'))) return next(new Error('You cannot delete this User'));

    /**
     * An oauth user can have multiple users in the api, every site has it's own user and right
     * In case for this oauth user there is only one site user in the API we also delete the oAuth user
     * Otherwise we keep the oAuth user since it's still needed for the other website
     */
    const userForAllSites = await db.User.findAll({where: {externalUserId: user.externalUserId}});
    
    if (userForAllSites.length <= 1) {
      let which = req.query.useOauth || 'default';
      let siteConfig = req.site && merge({}, req.site.config, { id: req.site.id });
      let result = await OAuthApi.deleteUser({ siteConfig, which, userData: { id: user.externalUserId }})
    }
    
    /**
     * Delete all connected arguments, votes and ideas created by the user
     */
    await db.Idea.destroy({where: {userId: req.results.id}});
    await db.Argument.destroy({where: {userId: req.results.id}});
    await db.Vote.destroy({where: {userId: req.results.id}});
    
    /**
     * Make anonymous? Delete posts
     */
    return req.results
      .destroy({force: true})
      .then(() => {
        res.json({"user": "deleted"});
      })
      .catch(next);

  })

// ----------------------------------------------------------------------------------------------------
// tmp endpoint to create anonymous users

// only available to admin
router.route('/anonymous-user-for-stemvan-site')
  .post(function (req, res, next) {
    if (!( req.user && req.user.role == 'admin' )) return next(createError(401, 'User is no admin'));
    return next()
  })
  .post(auth.can('User', 'create'))
  .post(function (req, res, next) {
    if (!req.site) return next(createError(401, 'Site niet gevonden'));
    return next();
  })
  .post(function (req, res, next) {
    let which = 'anonymous';
    let siteConfig = req.site && req.site.config;
    let userData = { postcode: req.body.postcode };
    OAuthApi
      .createUser({ siteConfig, which, userData })
      .then(json => {
        req.oAuthUser = json;
        next()
      })
      .catch(next);
  })
  .post(function (req, res, next) {
    const data = {
      zipCode: req.body.postcode,
      postcode: req.body.postcode,
      siteId: req.site.id,
      role: req.body.role ? req.body.role : 'anonymous',
      externalUserId: req.oAuthUser.id
    };
    db.User
      .authorizeData(data, 'create', req.user)
      .create(data)
      .then(result => {
        return res.json(result);
      })
      .catch(function (error) {
        // todo: dit komt uit de oude routes; maak het generieker
        if (typeof error == 'object' && error instanceof Sequelize.ValidationError) {
          let errors = [];

          error.errors.forEach(function (error) {
            errors.push(error.message);
          });

          res.status(422).json(errors);
        } else {
          next(error);
        }
      });
  });

// end tmp endpoint
// ----------------------------------------------------------------------------------------------------





module.exports = router;
