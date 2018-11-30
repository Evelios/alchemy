const Vector = require('vector');
const regularPolygon = require('regular-polygon');

module.exports = function inset(continuation, strength=0.75) {
  const inset_radius = strength * continuation.radius;

  let output_polygon = regularPolygon(
    continuation.nsides,
    continuation.center,
    inset_radius,
    continuation.rotation
  );
  output_polygon.push(output_polygon[0]);

  return {
    rendering : output_polygon,
    forks     : [],
    interior  : {
      center   : continuation.center,
      radius   : inset_radius,
      nsides   : continuation.nsides,
      rotation : continuation.rotation
    }
  };
};
