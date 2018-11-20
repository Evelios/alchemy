const regularPolygon = require('regular-polygon');
const Vector = require('vector');
const Alea = require('alea');
//
// TODO: Create a constructor and think about what the important variables to be in
//  the main object are. This could be some of the base returned continuations. Any
//  information that needs to be held about the output of one transmutation algorithm
//  to the next. Implementation details should be hidden from this function

const Rand = require('rand');

const AlchemyAlgorithms = require('./alchemy-bundle');

module.exports = (function () {
  let self = {};
  const CIRCLE_SIDES = 300;

  self.randInt = (min, max) => min + Math.ceil(Math.random() * (max -  min));

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

    const starting_polygon = getCircle(center, starting_size);

    let transmutation_polygons = [starting_polygon];
    let processed_transmutations = [starting_polygon];

    while (transmutation_polygons.length > 0) {

      const current_transmutation = transmutation_polygons.pop();
      const transmutation_algorithm = getNextAlgorithm();
      const processed_transmutation = transmutation_algorithm(current_transmutation);
      
      processed_transmutations.push(processed_transmutations);
      transmutation_polygons.push(
        processed_transmutation
          // Forking Continuation
          .filter(trans => trans.forks.length > 0)
          // Check for brancking size

          // Interior Continuation
          .filter(trans => trans.interior.length > 0)
          .filter(trans => trans.interior > min_size)
      );


    }
  };

  self.isForkingContinuation = function(transmutation) {
    return transmutation.forks.lengths > 0;
  };

  // Only works for regular polygons
  self.polygonSize = function(poly) {
    return Vector.distance(poly[0], Vector.avg(poly));
  };

  self.getPolygonCircle = function(center, size) {
    return regularPolygon(CIRCLE_SIDES, center, size);
  };

  self.getNextAlgorithm = function() {
    const algorithms = self.getAllAlgorithms();
    return algorithms[self.randInt(0, algorithms.length - 1)];
  };

  self.getAllAlgorithms = function() {
    return Object.entries(AlchemyAlgorithms).map(kv_pair => kv_pair[1]);
  };

  return self;
})();