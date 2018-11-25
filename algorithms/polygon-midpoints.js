const inscribePolygon = require('./inscribe-polygon');
const polygonEndpoints = require('./polygon-endpoints');

module.exports = function(poly) {
  return polygonEndpoints(inscribePolygon(poly));
}
