const convertDbPolygonToLatLng = require('./convert-db-polygon-to-lat-lng');

exports.formatPolygonToGeoJson = (polygons) => {

  //geoJSON has many more features, we just use this template because this is what
  //most generators and public data gives you and it looks is for the uploader and we can refer to a standard
  //but we don't save property for instance, it might be an idea to look into it for the future
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": polygons ? [polygons.map((polygon) => {
            return [polygon.lng, polygon.lat];
          })] : []
        }
      }
    ]
  };
}

exports.formatGeoJsonToPolygon = (geoJSON) => {
  if (!geoJSON || !geoJSON.features || !geoJSON.features[0] || !geoJSON.features[0].geometry || !geoJSON.features[0].geometry.coordinates || !geoJSON.features[0].geometry.coordinates[0]) return {};
  return convertDbPolygonToLatLng(geoJSON.features[0].geometry, 1, 0);
}
