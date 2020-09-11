var db = require('../src/db').sequelize;

module.exports = {
	up: function() {
		return db.query(`
		  ALTER TABLE users
				ADD phoneNumber  varchar(64) DEFAULT null AFTER zipcode,
				ADD streetName  varchar(64) DEFAULT null AFTER zipcode,
				ADD city  varchar(64) DEFAULT null AFTER zipcode,
				ADD houseNumber  varchar(64) DEFAULT null AFTER zipcode,
				ADD suffix  varchar(64) DEFAULT null AFTER zipcode,
				ADD postcode  varchar(64) DEFAULT null AFTER zipcode
				;
		`);
	},
	down: function() {
		return db.query(`ALTER TABLE user DROP phoneNumber, streetName, city, houseNumber, suffix, postcode;`);
	}
}
