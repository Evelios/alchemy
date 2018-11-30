const Vector = require('vector');
const regularPolygon = require('regular-polygon');
const NewArray = require('new-array');
const inscribePolygon = require('../algorithms/inscribe-polygon.js');

module.exports = function fork(continuation) {
  const N_CIRCLE_SIDES = 300;
  const fork_radius = continuation.radius / 4;

  const nsides = continuation.nsides;

  const forking_points = NewArray(nsides).map((_, i) => {
    const rotation = continuation.rotation + i * 2*Math.PI / nsides;
    return Vector.offset(continuation.center, continuation.radius, rotation);
  });

  const getRendering = function() {

    let outer_circle = regularPolygon(
      N_CIRCLE_SIDES,
      continuation.center,
      continuation.radius,
      continuation.rotation
    );
    outer_circle.push(outer_circle[0]);

    const forking_rendering = forking_points.map(pos => {
      let circle = regularPolygon(
        N_CIRCLE_SIDES,
        pos,
        fork_radius,
        continuation.rotation
      );
      circle.push(circle[0]);
      return circle;
    });

    let interior_polygon = regularPolygon(
      nsides,
      continuation.center,
      continuation.radius,
      continuation.rotation
    );
    interior_polygon.push(interior_polygon[0]);

    return [
      outer_circle,
      forking_rendering,
      interior_polygon
    ];
  }

  const getForks = function() {
    return forking_points.map(pos => {
      return {
        center   : pos,
        radius   : fork_radius,
        nsides   : nsides,
        rotation : 0,
      };
    });
  };

  const getInterior = function() {
    const interior_radius = continuation.radius * Math.cos(Math.PI / nsides);
    const interior_rotation = continuation.rotation + Math.PI / continuation.nsides;

    return {
      center   : continuation.center,
      radius   : interior_radius,
      nsides   : nsides,
      rotation : interior_rotation
    };
  };

  return {
    rendering : getRendering(),
    forks     : getForks(),
    interior  : getInterior()
  }
};
