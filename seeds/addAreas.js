const polygons = require('./data/polygons').default.polygons;

const db = require('../src/db');

Object.keys(polygons).forEach(async (name,) => {

  const polygon = polygons[name].map(polygon => {
    return [polygon.lat, polygon.lng];
  });
  try {
    await db.Area.create({
      name,
      polygon: {"type": "Polygon", coordinates: [polygon]}
    });
  } catch(error) {
    console.log(error.message);
  }

});
