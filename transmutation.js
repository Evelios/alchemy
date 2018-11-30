//
// TODO: Create a constructor and think about what the important variables to be in
//  the main object are. This could be some of the base returned continuations. Any
//  information that needs to be held about the output of one transmutation algorithm
//  to the next. Implementation details should be hidden from this function
//

// External Algorithms
const regularPolygon = require('regular-polygon');
const Vector = require('vector');
const Alea = require('alea');
const Rand = require('rand');
const defaultOpts = require('default-options');


module.exports = (function () {
  const CIRCLE_SIDES = 300;
  let self = {};
  let algorithm_index = 0;
  let opts;

  self.parseOptions = function(options) {
    const defaults = {
      center        : undefined,
      starting_size : undefined,
      max_size      : undefined,
      min_size      : undefined,
      algorithms    : undefined,
      nsides        : 6,
      rotation      : 0,
    };

    return defaultOpts(options, defaults);
  };

  /**
   * Create an alchemy transmutation. A collection of strokes leading to
   * an alchemy print.
   */
  self.transmute = function(options) {

    opts = self.parseOptions(options);

    console.log(opts)

    const starting_circle = {
      center   : opts.center,
      radius   : opts.starting_size,
      nsides   : opts.nsides,
      rotation : opts.rotation,
    };

    let transmutation_locations = [starting_circle];
    let output_renderings = [];
    // let output_renderings = [starting_rendering];

    while (transmutation_locations.length > 0) {
      console.log(`Transmutation Index : ${algorithm_index}`);

      // Run the next algorithm
      const current_transmutation = transmutation_locations.pop();
      const transmutation_algorithm = self.getNextAlgorithm();
      const output_transmutation = transmutation_algorithm(current_transmutation);

      // Add the output to the tracking arrays
      output_renderings.push(output_transmutation.rendering);

      // Add the interior continuations
      if (self.isInteriorContinuation(output_transmutation, opts.min_size)) {
        transmutation_locations.push(output_transmutation.interior);
      }

      // Add the forking continuations
      if (self.isForkingContinuation(output_transmutation)) {
        const continuations = output_transmutation.forks.filter(c => self.isCircleLargeEnough(c, opts.min_size));
        if (continuations.length > 0) {
          transmutation_locations.push(...continuations);
        }
      }

      algorithm_index++;
    }

    return output_renderings;
  };

  self.randInt = (min, max) => min + Math.ceil(Math.random() * (max -  min));

  self.isForkingContinuation = function(transmutation) {
    return transmutation.forks && transmutation.forks.length > 0;
  };

  self.isInteriorContinuation = function(transmutation, min_size) {
    return transmutation.interior && self.isCircleLargeEnough(transmutation.interior, min_size);
  }

  self.isCircleLargeEnough = function(circle, min_size) {
    return circle.radius > min_size; 
  }

  // Only works for regular polygons
  self.polygonSize = function(poly) {
    return Vector.distance(poly[0], Vector.avg(poly));
  };

  self.getNextAlgorithm = function() {
    return opts.algorithms[self.randInt(0, opts.algorithms.length - 1)];
  };

  return self;
})();
