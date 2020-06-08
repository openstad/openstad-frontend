const convertDbPolygonToLatLng = require ('../util/convert-db-polygon-to-lat-lng');

module.exports = function( db, sequelize, DataTypes ) {
  var Area = sequelize.define('area', {

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    polygon: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
      get: function () {
        return convertDbPolygonToLatLng(this.getDataValue('polygon'));
      }
    },

  });

  Area.associate = function( models ) {
    this.hasMany(models.Site);
  }

  return Area;

}
