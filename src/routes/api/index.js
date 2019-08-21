const express = require('express');
const bruteForce = require('../../middleware/brute-force');

let router = express.Router({mergeParams: true});

// brute force
router.use( bruteForce.globalMiddleware );
router.post( '*', bruteForce.postMiddleware );

// sites
router.use( '/site', require('./site') );

// arguments
router.use( '/site/:siteId(\\d+)(/idea/:ideaId(\\d+))?/argument', require('./argument') );

// ideas
router.use( '/site/:siteId(\\d+)/idea', require('./idea') );
//router.use( '/site/:siteId(\\d+)/idea', require('./idea.old') );

// submissions
router.use( '/site/:siteId(\\d+)/submission', require('./submission') );

// vote
router.use( '/site/:siteId(\\d+)/vote', require('./vote') );

// newslettersignup
router.use( '/site/:siteId(\\d+)/newslettersignup', require('./newslettersignup') );

// openstad-map
router.use( '/site/:siteId(\\d+)/openstad-map', require('./openstad-map') );

// output error as JSON only use this error handler middleware in "/api" based routes
router.use("/site", function(err, req, res, next){
  console.log('===> err', err);

  // use the error's status or default to 500
  res.status(err.status || 500);

  // send back json data
  res.send({
    message: err.message
  })
});

module.exports = router;
