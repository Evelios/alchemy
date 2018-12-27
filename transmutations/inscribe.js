const polyStrokes = require('../algorithms/poly-strokes');

const Base = require('./transmutation-base');

module.exports = (function() {
  function Inscribe(parent, parent_poly) {
    Base.call(this, parent, parent_poly);

    this.inset_radius = this.parent_poly.radius * Math.cos(Math.PI / this.parent_poly.nsides);
    this.inset_rotation = this.parent_poly.rotation + Math.PI / this.parent_poly.nsides;
  }
  Inscribe.prototype = Object.create(Base.prototype);

  Inscribe.prototype.getInterior = function() {
    return  {
      center   : this.parent_poly.center,
      nsides   : this.parent_poly.nsides,
      radius   : this.inset_radius,
      rotation : this.inset_rotation
    };
  };

  Inscribe.prototype.getRendering = function() {
    return [ polyStrokes(this.parent_poly) ];
  };

  return Inscribe;
})();