var base58      = require('bs58');
var config      = require('config');
var createError = require('http-errors');
var crypto      = require('crypto');
var Promise     = require('bluebird');

var TokenStore  = require('../TokenStore');
var store       = Promise.promisifyAll(new TokenStore());

module.exports = {
	generateToken: function( uid, originUrl ) {
		var token      = base58.encode(crypto.randomBytes(16));
		var validUntil = new Date(Date.now() + config.get('security.sessions.tokenTTL'));

		return store.storeOrUpdate(token, uid.toString(), validUntil, originUrl)
		.then(function() {
			return token;
		});
	},
	
	useToken: function( token, uid ) {
		if( !token || !uid ) {
			throw createError(400, 'Missing token or user ID');
		}
		
		// Returns `originUrl`.
		return store.authenticate(token, uid.toString())
		.tap(function() {
			return store.invalidateUser(uid);
		});
	}
};