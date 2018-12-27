module.exports = (function() {
  function TransmutationBase(parent, parent_poly) {
    this.parent = parent || null;
    this.parent_poly = parent_poly;
    this.children = [];
    this.depth = this.parent ? this.parent.depth + 1 : 0;
  }

  TransmutationBase.prototype.addChild = function(child) {
    this.children.push(child);
  };

  TransmutationBase.prototype.getInterior = function() {
    return null;
  };

  TransmutationBase.prototype.getForks = function() {
    return [];
  };

  TransmutationBase.prototype.getRendering = function() {
    throw Error('Function Not Implemented : getRendering');
  };

  TransmutationBase.prototype.getClippingPolygon = function() {
    return null;
  };
 
  return TransmutationBase;
})();