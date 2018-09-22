/**
 * 
 * @param {Vector} center The starting center point of the algorithm
 * @param {number} starting_size The starting size of the initial node
 * @param {number} max_size The maximum size to stop branching the algorithm
 *  ** This could be changed to a bounding function **
 * @param {number} min_size The minimum size of a circle to stop working inwards
 */
function transmute(center, starting_size, max_size, min_size) {

  const starting_polygon = getStartingPolygon();

  let transmutation_polygons = [starting_polygon];
  let processed_transmutations = [starting_polygon];

  while (transmutation_polygons.length > 0) {

    const current_transmutation = transmutation_polygons.pop();
    const transmutation_algorithm = chooseNextAlgoritm();
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
}

// Only works for regular polygons
function polygonSize(poly) {
  return 2 * Vector.distance(poly[0], Vector.avg(poly));
}

function getStartingPolygon() {

}

function chooseNextAlgorithm() {

}