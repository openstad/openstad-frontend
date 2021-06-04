var db = require('../src/db').sequelize;

module.exports = {
    up: function() {
        try {
            return db.query(`
			  ALTER TABLE actionRuns ADD COLUMN message VARCHAR(200) NULL DEFAULT NULL AFTER status;
			`);
        } catch(e) {
            return true;
        }
    },
    down: function() {
        return db.query(`ALTER TABLE newslettersignups DROP message;`);
    }
}
