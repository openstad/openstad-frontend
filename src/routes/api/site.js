const Promise 				= require('bluebird');
const express 				= require('express');
const config 					= require('config');
const fetch           = require('node-fetch');
const merge           = require('merge');
const db      				= require('../../db');
const auth 						= require('../../middleware/sequelize-authorization-middleware');
const pagination 			= require('../../middleware/pagination');
const searchResults 	= require('../../middleware/search-results-user');
const oauthClients 		= require('../../middleware/oauth-clients');
const checkHostStatus = require('../../services/checkHostStatus')
const OAuthApi        = require('../../services/oauth-api');

let router = express.Router({mergeParams: true});

const refreshSiteConfigMw = function (req, res, next) {
	const site = req.results;

	// assume https, wont work for some dev environments
	const cmsUrl = site.config.cms &&  site.config.cms.url ?  site.config.cms.url : 'https://' + site.domain;

	if (!cmsUrl) {
		next();
	}

	//return fetch(cmsUrl + '/modules/openstad-api/refresh')
	/*
		@todo The /modules/openstad-api/refresh is cleaner, doesn't require a restart
		but needs basichAuth headers in case a site is password protected
	 */
	return fetch(cmsUrl + '/config-reset')
		.then(function () { 	next();  })
		.catch(function (err) { console.log('errrr', err); next();	});
}

router.route('/')

// list sites
// ----------
	.get(auth.can('Site', 'list'))
	.get(pagination.init)
	.get(function(req, res, next) {
		const scope = ['withArea'];

		db.Site
			.scope(scope)
			.findAndCountAll({ offset: req.dbQuery.offset, limit: req.dbQuery.limit })
			.then( result => {
        req.results = result.rows;
        req.dbQuery.count = result.count;
        return next();
			})
			.catch(next);
	})
	.get(searchResults)
	.get(auth.useReqUser)
	.get(pagination.paginateResults)
	.get(function(req, res, next) {
    let records = req.results.records || req.results
		records.forEach((record, i) => {
      let site = record.toJSON()
			if (!( req.user && req.user.role && req.user.role == 'admin' )) {
        site.config = undefined;
			}
      records[i] = site;
    });
		res.json(req.results);
  })

// create site
// -----------
	.post(auth.can('Site', 'create'))
	.post(function(req, res, next) {
		db.Site
			.create(req.body)
			.then((result) => {
				req.results = result;
				next();
				//return checkHostStatus({id: result.id});
			})
			.catch(next)
	})
	.post(auth.useReqUser)
	.post(refreshSiteConfigMw)
	.post(function(req, res, next) {
    return res.json(req.results);
  })

// one site routes: get site
// -------------------------
router.route('/:siteIdOrDomain') //(\\d+)
	.all(auth.can('Site', 'view'))
	.all(function(req, res, next) {
		const siteIdOrDomain = req.params.siteIdOrDomain;
		let query;

		if (isNaN(siteIdOrDomain)) {
			query = {	where: { domain: siteIdOrDomain } }
		} else {
			query = { where: { id: parseInt(siteIdOrDomain) } }
		}

		db.Site
			.scope('withArea')
			.findOne(query)
			.then(found => {
				if ( !found ) throw new Error('Site not found');
				req.results = found;
				req.site = req.results; // middleware expects this to exist
				next();
			})
			.catch(next);
	})

// view site
// ---------
	.get(auth.can('Site', 'view'))
	.get(auth.useReqUser)
	.get(function(req, res, next) {
		res.json(req.results);
	})

// update site
// -----------
	.put(auth.useReqUser)
	.put(oauthClients.withAllForSite)
	.put(function(req, res, next) {
		const site = req.results;
    if (!( site && site.can && site.can('update') )) return next( new Error('You cannot update this site') );

		req.results
			.authorizeData(req.body, 'update')
			.update(req.body)
			.then(result => {
				return checkHostStatus({id: result.id});
			})
			.then(() => {
				next();
        return null;
			})
			.catch((err) => {
				console.log('ERROR',err);
				next();
        return null;
			});
	})

	// update certain parts of config to the oauth client
	// mainly styling settings are synched so in line with the CMS
	.put(function (req, res, next) {

    // todo: gebruik de oauth-api service
		const authServerUrl = config.authorization['auth-server-url'];
		const updates = [];

		req.siteOAuthClients.forEach((oauthClient, i) => {
			const authUpdateUrl = authServerUrl + '/api/admin/client/' + oauthClient.id;
			const configKeysToSync = ['users', 'styling', 'ideas'];

      // todo: gebruik de oauth-api service
      // todo: specifieker selecteren van sync velden (user.canCreateNewUsers)
      // todo: ik denk dat dit in het model moet    

			 oauthClient.config = oauthClient.config ? oauthClient.config : {};

			 configKeysToSync.forEach(field => {
				 oauthClient.config[field] = req.site.config[field];
			 });
       oauthClient.config['users'] = { canCreateNewUsers: req.site.config.users.canCreateNewUsers }


      const apiCredentials = {
				 client_id: oauthClient.clientId,
				 client_secret: oauthClient.clientSecret,
			 }

			 const options = {
				 method: 'post',
				 headers: {
					 'Content-Type': 'application/json',
				 },
				 mode: 'cors',
				 body: JSON.stringify(Object.assign(apiCredentials, oauthClient))
			 }

			 updates.push(fetch(authUpdateUrl, options));
		});

		Promise.all(updates)
			.then(() => {
				next()
			})
			.catch((e) => {
				console.log('errr oauth', e);
				next(e)
			});
	})
  // call the site, to let the site know a refresh of the siteConfig is needed
	.put(refreshSiteConfigMw)
	.put(function (req, res, next) {
		// when succesfull return site JSON
		res.json(req.results);
	})
// delete site
// ---------
	.delete(auth.can('Site', 'delete'))
	.delete(function(req, res, next) {
		req.results
			.destroy()
			.then(() => {
				res.json({ "site": "deleted" });
			})
			.catch(next);
	})

// anonymize all users
// -------------------
router.route('/:siteId(\\d+)/:willOrDo(will|do)-anonymize-all-users')
	.put(auth.can('Site', 'anonimizeAllUsers'))
	.put(function(req, res, next) {
    // the site
		let where = { id: parseInt(req.params.siteId) };
		db.Site
			.findOne({ where })
			.then(found => {
				if ( !found ) throw new Error('Site not found');
				req.results = found;
				req.site = req.results; // middleware expects this to exist
        next();
				return null;
			})
			.catch(next);
	})
  .put(async function (req, res, next) {
    try {
      if (req.params.willOrDo == 'do') {
        req.results = await req.site.doAnonymizeAllUsers();
      } else {
        req.results = await req.site.willAnonymizeAllUsers();
      }
      next();
			return null;
    } catch (err) {
      return next(err);
    }
  })
  .put(async function (req, res, next) {
    try {
      if (req.results.externalUserIds.length == 0) return next();
      for (let externalUserId of req.results.externalUserIds) {
        let users = await db.User.findAll({ where: { externalUserId } });
        if (users.length == 0) {
          // no api users left for this oauth user, so remove the oauth user
          let which = req.query.useOauth || 'default';
          let siteConfig = req.site && merge({}, req.site.config, { id: req.site.id });
          if (req.params.willOrDo == 'do') {
            let result = await OAuthApi.deleteUser({ siteConfig, which, userData: { id: externalUserId }})
          }
        }
      }
      next();
			return null;
    } catch (err) {
      return next(err);
    }
  })
  .put(function (req, res, next) {
    // customized version of auth.useReqUser
    delete req.results.externalUserIds
		Object.keys(req.results).forEach(which => {
			req.results[which] && req.results[which].forEach && req.results[which].forEach( result => {
				if (typeof result == 'object') {
					result.auth = result.auth || {};
					result.auth.user = req.user;
				}
			});
		});
    return next();
  })
  .put(function (req, res, next) {
    res.json(req.results);
  })


module.exports = router;
