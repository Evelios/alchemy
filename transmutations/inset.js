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
      radius   : this.inset_radius,
      rotation : this.parent_poly.rotation
    };
  };

  Inset.prototype.getRendering = function() {
    return [polyStrokes({
      center   : this.parent_poly.center,
      nsides   : this.parent_poly.nsides,
      radius   : this.inset_radius,
      rotation : this.parent_poly.rotation,
    })];
  };

  return Inset;
})();