const regularPolygon = require('regular-polygon');

module.exports = function(poly) {
  return regularPolygon(
    poly.nsides,
    poly.center,
    poly.radius,
    poly.rotation
  );
}
