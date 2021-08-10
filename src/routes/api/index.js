const express = require('express');
const bruteForce = require('../../middleware/brute-force');
const dbQuery = require('../../middleware/dbQuery');
const sorting = require('../../middleware/sorting');
const filtering = require('../../middleware/filtering');

const router = express.Router({mergeParams: true});

// brute force
//router.use( bruteForce.globalMiddleware );
//router.post( '*', bruteForce.postMiddleware );

// dbQuery middleware
router.use(dbQuery);
router.use(sorting);
router.use(filtering);

// sites
router.use( '/site', require('./site') );

// arguments
router.use( '/site/:siteId(\\d+)(/idea/:ideaId(\\d+))?/argument', require('./argument') );

// ideas
router.use( '/site/:siteId(\\d+)/idea', require('./idea') );
//router.use( '/site/:siteId(\\d+)/idea', require('./idea.old') );

// articles
router.use( '/site/:siteId(\\d+)/article', require('./article') );

// polls
router.use( '/site/:siteId(\\d+)(/idea/:ideaId(\\d+))?/poll', require('./poll') );

// tags
router.use( '/site/:siteId(\\d+)/tag', require('./tag') );

// users
router.use( '/site/:siteId(\\d+)/user', require('./user') );
router.use( '/site/:siteId(\\d+)/user/:userId(\\d+)/activity', require('./user-activity') );

// submissions
router.use( '/site/:siteId(\\d+)/submission', require('./submission') );

// vote
router.use( '/site/:siteId(\\d+)/vote', require('./vote') );

// newslettersignup
router.use( '/site/:siteId(\\d+)/newslettersignup', require('./newslettersignup') );

// choices-guide
router.use( '/site/:siteId(\\d+)/choicesguide', require('./choicesguide') );

router.use( '/site/:siteId(\\d+)/action', require('./action') );

// To do test and fix log API
//router.use( '/site/:siteId(\\d+)/log', require('./log') );

// openstad-map
router.use( '/site/:siteId(\\d+)/openstad-map', require('./openstad-map') );

// area on site and no site route, system wide the same
router.use( '/site/:siteId(\\d+)/area', require('./area') );
router.use( '/area', require('./area') );

router.use( '/repo', require('./externalSite') );

// output error as JSON only use this error handler middleware in "/api" based routes
router.use("/site", function(err, req, res, next){
  console.log('->>> err', err);
  // use the error's status or default to 500
  res.status(err.status || 500);

  // send back json data
  res.send({
    error:  err.message,
    message: err.message
  })
});

module.exports = router;
