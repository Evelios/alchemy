const Vector = require('vector');
const regularPolygon = require('regular-polygon');
const NewArray = require('new-array');
const inscribePolygon = require('../algorithms/inscribe-polygon.js');

module.exports = function fork(continuation) {
  const N_CIRCLE_SIDES = 300;
  const fork_radius = continuation.radius / 4;

  const nsides = continuation.nsides;

  let outer_circle = regularPolygon(
    N_CIRCLE_SIDES,
    continuation.center,
    continuation.radius,
    0
  );
  outer_circle.push(outer_circle[0]);

  const forking_points = NewArray(nsides).map((_, i) => {
    const rotation = continuation.rotation + i * 2*Math.PI / nsides;
    return Vector.offset(continuation.center, continuation.radius, rotation);
  });

  const forking_rendering = forking_points.map(pos => {
    let circle = regularPolygon(
      N_CIRCLE_SIDES,
      pos,
      fork_radius,
      0
    );
    circle.push(circle[0]);
    return circle;
  });

  let interior_polygon = regularPolygon(
    nsides,
    continuation.center,
    continuation.radius,
    0
  );
  interior_polygon.push(interior_polygon[0]);

  const interior_radius = continuation.radius * Math.cos(Math.PI / nsides);

  // ---- Output Variables ----

  const forking_continuations = forking_points.map(pos => {
    return {
      center   : pos,
      radius   : fork_radius,
      nsides   : nsides,
      rotation : 0,
    };
  });

  const interior_continuation = {
    center   : continuation.center,
    radius   : interior_radius,
    nsides   : nsides,
    rotation : 0
  };

  return {
    rendering : [
      outer_circle,
      forking_rendering,
      interior_polygon
    ],
    forks     : forking_continuations,
    interior  : interior_continuation
  }
};
