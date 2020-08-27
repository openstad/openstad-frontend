var base58      = require('bs58');
var config      = require('config');
var createError = require('http-errors');
var crypto      = require('crypto');
var Promise     = require('bluebird');

var db          = require('../../db');
var TokenStore  = require('../TokenStore');
var store       = Promise.promisifyAll(new TokenStore());

module.exports = {
	// TODO: Determine `validUntil` with an absolute date instead of relative?
	generateToken: function() {
		var token      = base58.encode(crypto.randomBytes(6)).toUpperCase();
		var validUntil = new Date(Date.now() + config.get('security.sessions.tokenTTL'));
		
		return db.User.registerAnonymous()
		.tap(function( user ) {
			return store.storeOrUpdate(token, user.id, validUntil);
		})
		.then(function( user ) {
			return `${user.id}-${token}`;
		});
	},
	
	// `code` = '${userId}-${token}'
	useToken: function( code ) {
		code || (code = '');
		var dashLoc = code.indexOf('-');
		var userId  = Number(code.substring(0, dashLoc));
		var token   = code.substring(dashLoc+1);
		
		if( !userId || !token ) {
			throw createError(400, 'Invalid code');
		}
		
		return store.authenticate(token, userId)
		.return(true);
	}
};