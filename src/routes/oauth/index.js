const express = require('express');

let router = express.Router({mergeParams: true});

// login routes
router.use( '/', require('./oauth') );

module.exports = router;
