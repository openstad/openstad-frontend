module.exports = function (polygon, latKey = 0, longKey = 1) {
  // TODO: resolve temporary fix for development (empty database)
  if (!polygon || !polygon.coordinates || !polygon.coordinates[0]) return [];

  // Coordinates are in a double array, we only need the first part
  return polygon.coordinates[0].map(x => {
    return {lat: x[latKey], lng: x[longKey]};
  });
}
