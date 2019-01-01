const Vector = require('vector');
const array = require('new-array');
const circleStrokes = require('../algorithms/circle-strokes');
const polyStrokes = require('../algorithms/poly-strokes');

const Base = require('./transmutation-base');

module.exports = (function() {
  function ExternalFork(parent, parent_poly, strength=0.25) {
    Base.call(this, parent, parent_poly);

  this.fork_radius = this.parent_poly.radius * strength;
  this.forking_points = array(this.parent_poly.nsides).map((_, i) => {
    const rotation = this.parent_poly.rotation + i * 2*Math.PI / this.parent_poly.nsides;
    return Vector.offset(this.parent_poly.center, this.parent_poly.radius, rotation);
  });
  }
  ExternalFork.prototype = Object.create(Base.prototype);

  ExternalFork.prototype.getForks = function() {
    return this.forking_points.map(pos => {
      return {
        center   : pos,
        radius   : this.fork_radius,
        nsides   : this.parent_poly.nsides,
        rotation : 0,
      };
    });
  };

  ExternalFork.prototype.getInterior = function() {
    const interior_radius = this.parent_poly.radius * Math.cos(Math.PI / this.parent_poly.nsides);
    const interior_rotation = this.parent_poly.rotation + Math.PI / this.parent_poly.nsides;

    return {
      center   : this.parent_poly.center,
      nsides   : this.parent_poly.nsides,
      radius   : interior_radius,
      rotation : interior_rotation
    };
  };

  ExternalFork.prototype.getRendering = function() {
    const outer_circle = circleStrokes({
      center : this.parent_poly.center,
      radius : this.parent_poly.radius
    });

    const forking_rendering = this.forking_points.map(pos => {
      return circleStrokes({
        center : pos,
        radius : this.fork_radius,
      });
    });

    const interior_polygon = polyStrokes(this.parent_poly);

    return [
      outer_circle,
      forking_rendering,
      interior_polygon
    ];
  };
  
  ExternalFork.prototype.getClipping = function() {
    return {
      center : this.parent_poly.center,
      radius : this.parent_poly.radius
    };
  };

  return ExternalFork;
})();
