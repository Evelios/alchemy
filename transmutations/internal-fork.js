const Vector = require('vector');
const array = require('new-array');
const circleStrokes = require('../algorithms/circle-strokes');

const Base = require('./transmutation-base');

module.exports = (function() {
  function InternalFork(parent, parent_poly, strength=1/parent_poly.nsides) {
    Base.call(this, parent, parent_poly);

    this.fork_radius = this.parent_poly.radius * strength;
    this.internal_radius = this.parent_poly.radius - 2 * this.fork_radius;

    this.forking_points = array(this.parent_poly.nsides).map((_, i) => {
      const rotation = this.parent_poly.rotation + i * 2*Math.PI / this.parent_poly.nsides;
      const offset_distance = this.parent_poly.radius - this.fork_radius;
      return Vector.offset(this.parent_poly.center, offset_distance, rotation);
    });
  }
  InternalFork.prototype = Object.create(Base.prototype);

  InternalFork.prototype.getInterior = function() {
    const interior_rotation = this.parent_poly.rotation + Math.PI / this.parent_poly.nsides;

    return {
      center   : this.parent_poly.center,
      radius   : this.internal_radius,
      nsides   : this.parent_poly.nsides,
      rotation : interior_rotation
    };
  };

  InternalFork.prototype.getForks = function() {
    return this.forking_points.map(pos => {
      return {
        center   : pos,
        radius   : this.fork_radius,
        nsides   : this.parent_poly.nsides,
        rotation : this.parent_poly.rotation,
      };
    });
  };

  InternalFork.prototype.getRendering = function() {

   let outer_circle = circleStrokes({
      center : this.parent_poly.center,
      radius : this.parent_poly.radius
   });

    const forking_rendering = this.forking_points.map(pos => {
      return circleStrokes({
        center : pos,
        radius : this.fork_radius
      });
    });

    const interior_circle = circleStrokes({
      center : this.parent_poly.center,
      radius : this.internal_radius
    });

    return [
      outer_circle,
      forking_rendering,
      interior_circle
    ];
  };

  InternalFork.prototype.getClipping = function() {
    return {
      center : this.parent_poly.center,
      radius : this.parent_poly.radius
    }
  };

  return InternalFork;
})();
