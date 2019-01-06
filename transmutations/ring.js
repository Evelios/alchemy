const polyEndpoints = require('../algorithms/polygon-endpoints');
const polyMidpoints = require('../algorithms/polygon-midpoints');
const polyStrokes = require('../algorithms/poly-strokes');
const inscribePolygon = require('../algorithms/inscribe-polygon');
const array = require('new-array');

const Base = require('./transmutation-base');

module.exports = (function() {
  function Ring(parent, parent_poly, options) {
    Base.call(this, parent, parent_poly, options, {
      strength : 0.5  
    });

    this.use_endpoints = this.opts.rng() > 0.5;
    this.rotate_internal = this.opts.rng() > 0.5;
    this.internal_poly = this.getInternalPoly();

    this.outer_connections = this.use_endpoints
      ? polyEndpoints(this.parent_poly)
      : polyMidpoints(this.parent_poly);

    this.inner_connections = 
      (this.use_endpoints && this.rotate_internal) ||
      (!this.use_endpoints && !this.rotate_internal)
        ? polyMidpoints(this.internal_poly)
        : polyEndpoints(this.internal_poly);
  }
  Ring.prototype = Object.create(Base.prototype);

  Ring.prototype.getInternalPoly = function() {
    const internal_radius = this.parent_poly.radius * this.opts.strength;

    const offset = Math.PI / this.parent_poly.nsides * (this.use_endpoints ? -1 : 1);
    const internal_rotation = this.rotate_internal
      ? this.parent_poly.rotation + offset 
      : this.parent_poly.rotation;

    return {
      center   : this.parent_poly.center,
      radius   : internal_radius,
      nsides   : this.parent_poly.nsides,
      rotation : internal_rotation
    };
  };

  Ring.prototype.getRendering = function() {
    const spokes = array(this.parent_poly.nsides).map((_, i) => {
      return [ this.outer_connections[i], this.inner_connections[i] ];
    });

    return [
      polyStrokes(this.parent_poly),
      polyStrokes(this.internal_poly),
      spokes
    ];
  };

  Ring.prototype.getInterior = function() {
    return inscribePolygon(this.internal_poly);
  };

  return Ring;
})();
