const polyStrokes = require('../algorithms/poly-strokes');
const Base = require('./transmutation-base');

module.exports = (function() {
  function Inset(parent, parent_poly, strength=0.75) {
    Base.call(this, parent, parent_poly);

    this.inset_radius = strength * this.parent_poly.radius;
  }
  Inset.prototype = Object.create(Base.prototype);

  Inset.prototype.getInterior = function() {
    return {
      center   : this.parent_poly.center,
      nsides   : this.parent_poly.nsides,
      rotation : this.parent_poly.rotation,
      radius   : this.inset_radius
    };
  };

  Inset.prototype.getRendering = function() {
    return [polyStrokes(this.getInterior)];
  };

  Inset.prototype.getClipping = function() {
    return this.getRendering();
  };

  return Inset;
})();