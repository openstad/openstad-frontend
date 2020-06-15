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


  Area.auth = Area.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: ['editor','owner', 'admin'],
    updateableBy: ['editor','owner', 'admin'],
    deleteableBy: ['editor','owner', 'admin'],
  }


  return Area;
}
