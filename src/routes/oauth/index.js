const express = require('express');
const bruteForce = require('../../middleware/brute-force');

let router = express.Router({mergeParams: true});

// brute force
router.use( bruteForce.globalMiddleware );
router.post( '*', bruteForce.postMiddleware );

// login routes
router.use( '/', require('./oauth') );

module.exports = router;
