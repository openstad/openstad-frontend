const express = require('express');
const bruteForce = require('../../middleware/brute-force');

let router = express.Router({mergeParams: true});

// brute force
router.use( bruteForce.global.getMiddleware() );
router.post( '*', bruteForce.post.getMiddleware() );

// login routes
router.use( '/', require('./oauth') );

module.exports = router;
