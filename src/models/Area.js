const convertDbPolygonToLatLng = require ('../util/convert-db-polygon-to-lat-lng');
const {formatPolygonToGeoJson} = require('../util/geo-json-formatter');

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
      set: function (polygon) {
        polygon = polygon ? polygon.map(polygon => {
          return [polygon.lat, polygon.lng];
        }) : [];

        const formattedPolygon = {"type": "Polygon", coordinates: [polygon]};

        this.setDataValue('polygon',formattedPolygon);
      },
      get: function () {
        return convertDbPolygonToLatLng(this.getDataValue('polygon'));
      }
    },
    /*
    Virtual field would be a nice way to manage the geoJSON version of the data
    geoJSON: {
      type: DataTypes.VIRTUAL,
      get: function () {
        return formatPolygonToGeoJson(this.getDataValue('polygon'))
      }
    },
    */
  });

  Area.associate = function( models ) {
    this.hasMany(models.Site);
  }


  Area.auth = Area.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: ['admin'],
    updateableBy: ['admin'],
    deleteableBy: ['admin'],
    toAuthorizedJSON: function(user, data) {
      data.geoJSON = formatPolygonToGeoJson(data.polygon);
      return data;
    }
  }


  return Area;
}
