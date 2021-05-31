module.exports = function( db, sequelize, DataTypes ) {
    var ActionRun = sequelize.define('actionRun', {
        status: {
            type         : DataTypes.ENUM('running', 'finished', 'errored'),
            defaultValue : 'running',
            allowNull    : false
        },
    });

    ActionRun.associate = function( models ) {
        this.belongsTo(models.User);
    }

    ActionRun.auth = ActionRun.prototype.auth = {
        listableBy: 'admin',
        viewableBy: 'admin',
        createableBy: ['admin'],
        updateableBy: ['admin'],
        deleteableBy: ['admin'],
        toAuthorizedJSON: function(user, data) {
            return data;
        }
    }


    return ActionRun;
}
