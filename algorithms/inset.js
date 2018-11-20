const Vector = require('vector');

module.exports = function inset(polygon, num_sides, strength, rotation=0) {
  const center = Vector.avg(polygon);
  const inset_radius = strength * Vector.distance(polygon[0], center);

  return regularPolygon(num_sides, center, inset_radius, rotation);
};