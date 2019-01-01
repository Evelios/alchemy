const array = require('new-array');
const Vector = require('vector');

const lineIntersection = require('line-intersection');
const polyEndpoints = require('../algorithms/polygon-endpoints');
const polyStrokes = require('../algorithms/poly-strokes');
const inscribePolygon = require('../algorithms/inscribe-polygon');

const Base = require('./transmutation-base');

module.exports = (function() {
  function Spyglass(parent, parent_poly, strength=0.5) {
    Base.call(this, parent, parent_poly);

    this.rotate_right = Math.random() > 0.5;
    this.strength = strength;
  }
  Spyglass.prototype = Object.create(Base.prototype);

  Spyglass.prototype.getInterior = function() {
    const internal_endpoints = this.getInternalEndpoints(); 
    const internal_vector = Vector.subtract(internal_endpoints[0], this.parent_poly.center);
    
    const rotation = Vector.angle(internal_vector);
    const radius = Vector.magnitude(internal_vector);

    return inscribePolygon({
      center   : this.parent_poly.center,
      nsides   : this.parent_poly.nsides,
      radius   : radius,
      rotation : rotation 
    });
  };

  Spyglass.prototype.getRendering = function() {
    return [
      polyStrokes(this.parent_poly),
      this.getSpokes(),
    ];
  };

  Spyglass.prototype.getSpokes = function() {
    const external_endpoints = polyEndpoints(this.parent_poly);
    const internal_endpoints = this.getInternalEndpoints();

    return array(this.parent_poly.nsides).map((_, i) => {
      return [ external_endpoints[i], internal_endpoints[i] ];
    }); 
  };

  Spyglass.prototype.getInternalEndpoints = function() {
    const internal_poly_angle = (this.parent_poly.nsides - 2) * Math.PI / this.parent_poly.nsides / 2;
    const direction = this.rotate_right ? -1 : 1;

    // Get the lines that the spyglass will run allong
    const spyglass_lines = polyEndpoints(this.parent_poly).map(pos => {
      const diagonal_angle = Vector.angle(Vector.subtract(this.parent_poly.center, pos));
      const vector_angle = diagonal_angle + direction * internal_poly_angle * (1 - this.strength);
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

  return Spyglass;
})();
