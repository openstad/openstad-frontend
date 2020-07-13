const express = require('express');
const createError = require('http-errors');
const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const mail = require('../../lib/mail');
const generateToken = require('../../util/generate-token');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results');

const router = express.Router({ mergeParams: true });

// scopes: for all get requests
router
  .all('*', function(req, res, next) {
    req.scope = [{ method: ['forSiteId', req.site.id] }];
    return next();
  });

router.route('/$')

// list newslettersignups
// ----------------------
  .get(auth.can('NewsletterSignup', 'list'))
	.get(pagination.init)
  .get(function(req, res, next) {
    let { dbQuery } = req;

    let where = { siteId: req.site.id };
    let confirmed = req.query.confirmed;
    if ( typeof confirmed !== 'undefined' ) where.confirmed = !( confirmed == 'false' || confirmed == '0' );
    db.NewsletterSignup
      .scope(...req.scope)
			.findAndCountAll({ where, ...dbQuery })
      .then( (result) => {
        req.results = result.rows;
        req.dbQuery.count = result.count;
        return next();
      })
      .catch(next);
  })
	.get(auth.useReqUser)
	.get(searchResults)
	.get(pagination.paginateResults)
	.get(function(req, res, next) {
		res.json(req.results);
  })

// create newslettersignup
// -----------------------
  .post(auth.can('NewsletterSignup', 'create'))
	.post(auth.useReqUser)
  .post(function(req, res, next) {
    if (!req.site) return next(createError(404, 'Site niet gevonden'));
    return next();
  })
  .post(function(req, res, next) {
    let isActive = req.site && req.site.config && req.site.config.newslettersignup && req.site.config.newslettersignup.isActive;
    if (!isActive) return next(createError(500, 'Nieuwsbrief aanmeldingen zijn momenteel gesloten.'));
    let confirmationUrl = req.site.config.newslettersignup.confirmationEmail && req.site.config.newslettersignup.confirmationEmail.url;
    if (!confirmationUrl) return next(createError(500, 'Configuratiefout: confirmationUrl is niet gedefinieerd. Waarschuw de site beheerder.'));
    if (req.user && req.user.email && req.user.email !== req.body.email) return next(createError(400, 'Dat is niet het emailadres waarmee je bent ingelogd'));
    return next();
  })
  .post(function( req, res, next ) {
    db.NewsletterSignup
      .findOne({ where: { siteId: req.site.id, email: req.body.email } })
      .then((found) => {
        if (found) {
          if (!found.externalUserId && req.user.email == found.email) {
            found
              .update({
                externalUserId: req.user.externalUserId,
                confirmed: true,
                confirmToken: null,
              })
              .then((result) => {
                return next(createError(400, 'Je bent al aangemeld. Je aanmelding is nu ook bevestigd.'));
              })
              .catch(next);
          } else {
            return next(createError(400, 'Je bent al aangemeld'));
          }
        } else {
          return next();
        }
      })
      .catch(next);
  })
  .post(function( req, res, next ) {

    let data = {};

    // TODO: dit kan nu via de auth van het model
    if (req.user && req.user.email) {
      data.email = req.user.email;
      data.firstName = req.user.firstName;
      data.lastName = req.user.lastName;
      data.confirmed = true;
    } else {
      data.email = req.body.email;
      data.firstName = req.body.firstName;
      data.lastName = req.body.lastName;
      data.confirmed = req.site && req.site.config && req.site.config.newslettersignup && req.site.config.newslettersignup.autoConfirm;
      if (!data.confirmed) {
        data.confirmToken = generateToken({ length: 256 });
      }
    }
    data.siteId = req.site.id;
    data.externalUserId = req.user.externalUserId;
    data.signoutToken = generateToken({ length: 256 });

    db.NewsletterSignup
      .create(data)
      .then((result) => {
        res.json(result);
        if (!result.confirmed) {
          mail.sendNewsletterSignupConfirmationMail(data, req.user, req.site); // todo: optional met config?
        }
      })
      .catch(next);
  });

// confirm signup
// --------------
router.route('/confirm$')
  .post(auth.can('NewsletterSignup', 'confirm'))
	.post(auth.useReqUser)
  .post(function(req, res, next) {
    if (!req.body.confirmToken || !req.body.confirmToken.match(/^[a-zA-Z0-9]{256}$/)) return next(createError(404, 'Token niet gevonden'));
    return next();
  })
  .post(function(req, res, next) {
    db.NewsletterSignup
      .findOne({ where: { confirmToken: req.body.confirmToken, siteId: req.site.id } })
      .then((found) => {
        if (!found) return next(createError(404, 'Aanmelding niet gevonden'));
        found
          .update({
            confirmed: true,
            confirmToken: null,
          })
          .then((result) => {
            // TODO: dit kan weg, maar ff checken tegen de auth settings
            let json = {
              id: result.id,
              siteId: result.siteId,
              email: result.email,
              firstName: result.firstName,
              lastName: result.lastName,
              externalUserId: result.externalUserId,
              confirmed: result.confirmed,
              signoutToken: result.signoutToken,
            };
            return res.json(json);
          })
          .catch(next);
      });
  });

// signout
// -------
router.route('/signout$')
  .post(auth.can('NewsletterSignup', 'signout'))
  .post(function(req, res, next) {
    if (!req.body.signoutToken || !req.body.signoutToken.match(/^[a-zA-Z0-9]{256}$/)) return next(createError(404, 'Token niet gevonden'));
    return next();
  })
  .post(function(req, res, next) {
    db.NewsletterSignup
      .findOne({ where: { signoutToken: req.body.signoutToken, siteId: req.site.id } })
      .then((found) => {
        if (!found) return next(createError(404, 'Aanmelding niet gevonden'));
        found
          .destroy()
          .then((result) => {
            return res.json({ message: 'aanmmelding verwijderd' });
          })
          .catch(next);
      });
  });

// one newslettersignup
// --------------------
router.route('/:newslettersignupId(\\d+)')
  .all(function(req, res, next) {
    let newslettersignupId = parseInt(req.params.newslettersignupId) || 1;

    db.NewsletterSignup
      .scope(...req.scope)
      .findOne({
        where: { id: newslettersignupId, siteId: req.site.id }
      })
      .then((found) => {
        if ( !found ) throw createError(404, 'Aanmelding niet gevonden');
        req.results = found;
        next();
      })
      .catch(next);
  })

// update newslettersignup
// -----------------------
	.put(auth.useReqUser)
  .put(function(req, res, next) {
		var newslettersignup = req.results;
    if (!( newslettersignup && newslettersignup.can && newslettersignup.can('update') )) return next( new Error('You cannot update this newslettersignup') );
		newslettersignup
      .update(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  })

// delete idea
// ---------
  .delete(auth.can('NewsletterSignup', 'delete'))
  .delete(function(req, res, next) {
    req.results
      .destroy()
      .then(() => {
        res.json({ newslettersignup: 'deleted' });
      })
      .catch(next);
  });

module.exports = router;
