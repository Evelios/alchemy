const Vector = require('vector');
const regularPolygon = require('regular-polygon');

module.exports = function inscribe(continuation) {
  const nsides = continuation.nsides
  const inset_radius = continuation.radius * Math.cos(Math.PI / nsides);
  const inset_rotation = continuation.rotation + Math.PI / nsides;

  let output_polygon = regularPolygon(
    nsides,
    continuation.center,
    continuation.radius,
    inset_rotation
  );
  output_polygon.push(output_polygon[0]);

  return {
    rendering : output_polygon,
    forks     : [],
    interior  : {
      center   : continuation.center,
      radius   : inset_radius,
      nsides   : continuation.nsides,
      rotation : inset_rotation 
    } 
  };
};
