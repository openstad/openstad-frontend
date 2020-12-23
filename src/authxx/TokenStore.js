// Original: https://github.com/andreafalzetti/passwordless-nodecache
// Modified to clean up, and to use `bcrypt` instead of `bcryptjs`.

var bcrypt      = require('bcrypt');
var createError = require('http-errors');
var extend      = require('lodash/extend');
var Promise     = require('bluebird');
var TokenStore  = require('passwordless-tokenstore');
var util        = require('util');

var AuthToken   = require('../db').AuthToken;

function SequelizeStore() {
	TokenStore.call(this);
}
util.inherits(SequelizeStore, TokenStore);

extend(SequelizeStore.prototype, {
	authenticate: function( token, uid, callback ) {
		if( !token || !uid ) {
			throw createError(500, 'TokenStore:authenticate called with invalid parameters');
		}
		
		var item;
		return AuthToken.findByUID(uid)
		.bind(this)
		.then(function( result ) {
			if( !result ) {
				throw createError(404, 'Code niet gevonden');
			}
			
			item = result;
			return this._validateToken(token, item);
		})
		.then(function( isValidToken ) {
			if( !isValidToken ) {
				throw createError(401, 'Ongeldige link');
			}
			
			return item.originUrl || '';
		})
		.asCallback(callback);
	},

	storeOrUpdate: function( token, uid, validUntil, originUrl, callback ) {
		if( !token || !uid || !(validUntil instanceof Date) ) {
			throw createError(400, 'TokenStore:storeOrUpdate called with invalid parameters');
		}

		return bcrypt.hash(token, 10)
		.then(function( hashedToken ) {
			var newRecord = {
				hashedToken : hashedToken,
				uid         : uid,
				validUntil  : validUntil,
				originUrl   : originUrl
			};

			return AuthToken.upsert(newRecord).asCallback(callback);
		});
	},

	invalidateUser: function( uid, callback ) {
		if( !uid ) {
			throw createError(400, 'TokenStore:invalidateUser called with invalid parameters');
		}

		return AuthToken.destroyByUID(uid).asCallback(callback);
	},

	clear: function( callback ) {
		if( !callback ) {
			throw createError(400, 'TokenStore:clear called with invalid parameters');
		}
		
		return AuthToken.truncate().asCallback(callback);
	},

	length: function( callback ) {
		return AuthToken.count().asCallback(callback);
	},

	_validateToken: function( token, storedItem ) {
		if( !storedItem || storedItem.validUntil < new Date() ) {
			return Promise.reject();
		}
		
		return bcrypt.compare(token, storedItem.hashedToken);
	}
});

module.exports = SequelizeStore;