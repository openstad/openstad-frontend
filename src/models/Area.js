module.exports = function( db, sequelize, DataTypes ) {
	var Area = sequelize.define('area', {

		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		
	  polygon: {
	    type: DataTypes.GEOMETRY,
      allowNull: false
    },

	});

	Area.associate = function( models ) {
		this.hasMany(models.Site);
	}

	return Area;

}
