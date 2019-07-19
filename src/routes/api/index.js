const express = require('express');

let router = express.Router({mergeParams: true});

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

// openstad-map
router.use( '/site/:siteId(\\d+)/openstad-map', require('./openstad-map') );

module.exports = router;
