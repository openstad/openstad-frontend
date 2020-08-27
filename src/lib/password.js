var bcrypt = require('bcrypt');
var config = require('config');

module.exports = {
	bcrypt: {
		hash: function( input ) {
			var cost = config.get('security.passwordHashing.methods.bcrypt.cost');
			var salt = bcrypt.genSaltSync(cost);
			var hash = bcrypt.hashSync(input, salt);
			return {
				method : 'bcrypt',
				cost   : cost,
				salt   : salt,
				hash   : hash
			};
		},
		compare: function( input, hashObject ) {
			return bcrypt.compareSync(input, hashObject.hash);
		}
	}
}