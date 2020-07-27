const express = require('express');
const bruteForce = require('../../middleware/brute-force');

let router = express.Router({mergeParams: true});

// brute force
router.use( bruteForce.globalMiddleware );
router.post( '*', bruteForce.postMiddleware );

// vote
router.use( '/site/:siteId(\\d+)/vote', require('./vote') );

// vote
router.use( '/site/:siteId(\\d+)/idea', require('./idea') );

module.exports = router;
