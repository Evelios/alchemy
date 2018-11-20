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
const inset = require('./algorithms/inset');
// const AlchemyAlgorithms = require('./alchemy-bundle');

module.exports = (function () {
  let self = {};
  const CIRCLE_SIDES = 300;


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
      nsides   : 6,
      rotation : 0,
    };

    const starting_rendering = self.getPolygonCircle(starting_circle);

    let transmutation_locations = [starting_circle];
    let output_renderings = [starting_rendering];

    while (transmutation_locations.length > 0) {

      // Run the next algorithm
      const current_transmutation = transmutation_locations.pop();
      const transmutation_algorithm = self.getNextAlgorithm();
      const output_transmutation = transmutation_algorithm(current_transmutation);

      // Add the output to the tracking arrays
      output_renderings.push(output_transmutation.rendering);

      if (self.isInteriorContinuation(output_transmutation, min_size)) {
        transmutation_locations.push(output_transmutation.interior);
      }

    }

    return output_renderings;
  };

  self.randInt = (min, max) => min + Math.ceil(Math.random() * (max -  min));

  self.isForkingContinuation = function(transmutation) {
    return transmutation.forks.length > 0;
  };

  self.isInteriorContinuation = function(transmutation, min_size) {
    return transmutation.interior && transmutation.interior.radius > min_size;
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
    const algorithms = self.getAllAlgorithms();
    return algorithms[self.randInt(0, algorithms.length - 1)];
  };

  self.getAllAlgorithms = function() {
    return [
      inset
    ];
    // return Object.entries(AlchemyAlgorithms).map(kv_pair => kv_pair[1]);
  };

  return self;
})();