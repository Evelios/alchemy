const array = require('new-array');
const Vector = require('vector');

const lineIntersection = require('line-intersection');
const polyEndpoints = require('../algorithms/polygon-endpoints');
const polyMidpoints = require('../algorithms/polygon-midpoints');
const circleStrokes = require('../algorithms/circle-strokes');
const polyStrokes = require('../algorithms/poly-strokes');
const inscribePolygon = require('../algorithms/inscribe-polygon');


module.exports = function(continuation, strength=0.5) {
  const rotate_right = true;

  const getInternalEndpoints = function() {
    const internal_poly_angle = (continuation.nsides - 2) * Math.PI / continuation.nsides / 2;
    const direction = rotate_right ? -1 : 1;

    // Get the lines that the spyglass will run allong
    const spyglass_lines = polyEndpoints(continuation).map(pos => {
      const diagonal_angle = Vector.angle(Vector.subtract(continuation.center, pos));
      const vector_angle = diagonal_angle + direction * internal_poly_angle * (1 - strength);
      return [pos, Vector.offset(pos, 1, vector_angle)];
    });

    // Get the intersection point of the spyglass lines
    const internal_endpoints = spyglass_lines.map((line, i) => {
      const len = spyglass_lines.length;
      const next_index = ((i - direction) + len) % len;
      const next_line = spyglass_lines[next_index];

      return lineIntersection(line, next_line); 
    });

    return internal_endpoints;
  };

  const getSpokes = function() {
    const external_endpoints = polyEndpoints(continuation);
    const internal_endpoints = getInternalEndpoints();

    return array(continuation.nsides).map((_, i) => {
      return [ external_endpoints[i], internal_endpoints[i] ];
    }); 
  };

  const getRendering = function() {
    return [
      polyStrokes(continuation),
      getSpokes(),
    ];
  };

  const getForks = function() {
    return null;
  };

  const getInterior = function() {
    const internal_endpoints = getInternalEndpoints(); 
    const internal_vector = Vector.subtract(internal_endpoints[0], continuation.center);
    
    const rotation = Vector.angle(internal_vector);
    const radius = Vector.magnitude(internal_vector);

    return inscribePolygon({
      center : continuation.center,
      radius : radius,
      nsides : continuation.nsides,
      rotation : rotation 
    });
  };

  return {
    rendering : getRendering(), 
    forks     : getForks(),
    interior  : getInterior()
  };
};
