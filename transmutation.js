//
// TODO: Create a constructor and think about what the important variables to be in
//  the main object are. This could be some of the base returned continuations. Any
//  information that needs to be held about the output of one transmutation algorithm
//  to the next. Implementation details should be hidden from this function
//

const regularPolygon = require('regular-polygon');
const Vector = require('vector');
const Alea = require('alea');
const Rand = require('rand');
const inscribe = require('./transmutations/inscribe');
const internalFork = require('./transmutations/internal-fork');
const externalFork = require('./transmutations/external-fork');
const ring = require('./transmutations/ring');

module.exports = (function () {
  const CIRCLE_SIDES = 300;
  let self = {};
  let algorithm_index = 0;

  /**
   * Create an alchemy transmutation. A collection of strokes leading to
   * an alchemy print.
   * 
   * @param {Vector} center The starting center point of the algorithm
   * @param {number} starting_size The starting size of the initial node
   * @param {number} max_size The maximum size to stop branching the algorithm
   *  ** This could be changed to a bounding function **
   * @param {number} min_size The minimum size of a circle to stop working inwards
   */
  self.transmute = function(center, starting_size, max_size, min_size) {

    const starting_circle = {
      center   : center,
      radius   : starting_size,
      nsides   : 5, 
      rotation : 0,
    };

    // const starting_rendering = self.getPolygonCircle(starting_circle);

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
      if (self.isInteriorContinuation(output_transmutation, min_size)) {
        transmutation_locations.push(output_transmutation.interior);
      }

      // Add the forking continuations
      if (self.isForkingContinuation(output_transmutation)) {
        const continuations = output_transmutation.forks.filter(c => self.isCircleLargeEnough(c, min_size));
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

  self.getPolygonCircle = function(circle) {
    let polygon = regularPolygon(CIRCLE_SIDES, circle.center, circle.radius);
    polygon.push(polygon[0]);
    return polygon;
  };

  self.getNextAlgorithm = function() {
    if (algorithm_index === 0) {
      return internalFork;
    }

    const algorithms = self.getAllAlgorithms();
    return algorithms[self.randInt(0, algorithms.length - 1)];
  };

  self.getAllAlgorithms = function() {
    return [
      ring
    ];
  };

  return self;
})();
