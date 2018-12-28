const polyStrokes = require('../algorithms/poly-strokes');

module.exports = (function() {
  function TransmutationBase(parent, parent_poly) {
  /**
   * @param {TransmutationBase|null} parent The parent transmutation to the
   *   current transmutation. `null` parent is the root algorithm
   * @param {Polygon} parent_poly The boundary of the parent polygon. This is
   *   the base that is used to create the current transmutation
   */
    this.parent = parent || null;
    this.parent_poly = parent_poly;
    this.children = [];
    this.depth = this.parent ? this.parent.depth + 1 : 0;
  }

  TransmutationBase.prototype.addChild = function(child) {
  /**
   * Add the child algorithm to the list of children contained under this
   * particular transmutation.
   * 
   * @param {TransmutationBase} child The child transmutation to add
   */
    this.children.push(child);
  };

  TransmutationBase.prototype.hasChildren = function() {
  /**
   * If the current transmutation node has any children nodes
   * 
   * @returns {boolean}
   */
    return this.children.length > 0;
  };

  TransmutationBase.prototype.getInterior = function() {
  /**
   * This function specifies if and where the algorithm
   * continues within the interior of the current algorithm.
   * If the algorithm doesn't continue this function should return `null`
   * @returns {Polygon|null}
   */
    return null;
  };

  TransmutationBase.prototype.getForks = function() {
  /**
   * This is the output of the transmutation forking points where
   * the child algorithms can be spawned away from the center of
   * the original algorithm.
   * 
   * @returns {Polygon[]}
   */
    return [];
  };

  TransmutationBase.prototype.getRendering = function() {
  /**
   * This is the rendering lines for rendering the transmutation
   * element. This is a required function.
   * 
   * @returns {Stroke[]} The output rendering lines
   */
    throw Error('Function Not Implemented : getRendering');
  };

  TransmutationBase.prototype.getClipping = function() {
  /**
   * The polygon that is used for clipping the parent drawings. This must be in
   * the stroke format. If the algorithm returns `null` then no clipping will be
   * performed.
   * 
   * The format is described by the GeoJSON format from
   * https://tools.ietf.org/html/rfc7946#section-3.1
   * which is used because of the package for polygon clipping
   * https://www.npmjs.com/package/polygon-clipping
   * 
   * @returns {Stroke[[]]|null}
   */
    return [ polyStrokes(this.parent_poly) ];
  };
 
  return TransmutationBase;
})();