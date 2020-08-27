const polygons = require('./data/polygons').default.polygons;

const db = require('../src/db');

Object.keys(polygons).forEach(async (name) => {
  const polygon = polygons[name];

  try {
    await db.Area.create({
      name,
      polygon: polygon
    });
  } catch(error) {
    console.log(error.message);
  }

});
