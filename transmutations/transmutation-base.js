const polyStrokes = require('../algorithms/poly-strokes');

const defaultOpts = require('default-options');
const Alea = require('alea');

module.exports = (function() {
  function TransmutationBase(parent, parent_poly, options, defaults) {
  /**
   * @param {TransmutationBase|null} parent The parent transmutation to the
   *   current transmutation. `null` parent is the root algorithm
   * @param {Polygon} parent_poly The boundary of the parent polygon. This is
   *   the base that is used to create the current transmutation
   */
    this.parent = parent || null;
    this.depth = this.parent ? this.parent.depth + 1 : 0;
    this.children = [];

    this.parent_poly = parent_poly;
    this.parent_poly.radius -= 100 * Number.EPSILON;
  
    this.opts = this.parseOptions(options, defaults);
    this.child_seed = this.opts.rng();
  }

  TransmutationBase.prototype.parseOptions = function(options, defaults) {
    this.defaults = this.mergeDefaults(defaults, {
      rng : undefined 
    });

    return defaultOpts(options, this.defaults);
  };

  TransmutationBase.prototype.mergeDefaults = function(user_defaults, defaults) {
    let merged_defaults = defaults;

    for (var key in user_defaults) {
        merged_defaults[key] = user_defaults[key];
      if (user_defaults.hasOwnProperty(key)) {
      }
    }

    return merged_defaults;
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

  TransmutationBase.prototype.getChildRng = function(child) {
    return new Alea(this.child_seed);
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
   * @returns {Polygon|Circle|null}
   */
    return this.parent_poly;
  };
 
  return TransmutationBase;
})();
