const polyEndpoints = require('../algorithms/polygon-endpoints');
const polyMidpoints = require('../algorithms/polygon-midpoints');
const circleStrokes = require('../algorithms/circle-strokes');
const polyStrokes = require('../algorithms/poly-strokes');
const inscribePolygon = require('../algorithms/inscribe-polygon');
const array = require('new-array');


module.exports = function(continuation, strength=0.5) {
  const use_endpoints = Math.random() > 0.5;
  const rotate_internal = Math.random() > 0.5;

  const nsides = continuation.nsides;
  const internal_radius = continuation.radius * strength;

  const offset = Math.PI / continuation.nsides * (use_endpoints ? -1 : 1)

  const internal_rotation = rotate_internal
    ? continuation.rotation + offset 
    : continuation.rotation;

  const internal_poly = {
    center : continuation.center,
    radius : internal_radius,
    nsides : nsides,
    rotation : internal_rotation
  }

  const outer_connections = use_endpoints
    ? polyEndpoints(continuation)
    : polyMidpoints(continuation);

  const inner_connections = 
    (use_endpoints && rotate_internal) || (!use_endpoints && !rotate_internal)
      ? polyMidpoints(internal_poly)
      : polyEndpoints(internal_poly);

  const getRendering = function() {
    const spokes = array(nsides).map((_, i) => {
      return [ outer_connections[i], inner_connections[i] ];
    });

    return [
      polyStrokes(continuation),
      polyStrokes(internal_poly),
      spokes
    ];
  };

  const getForks = function() {
    return null;
  };

  const getInterior = function() {
    return inscribePolygon(internal_poly);
  };

  return {
    rendering : getRendering(), 
    forks     : getForks(),
    interior  : getInterior()
  }
};
