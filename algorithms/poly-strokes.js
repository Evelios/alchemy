const polygonEndpoints = require('./polygon-endpoints');

module.exports = function(poly) {

  let strokes = polygonEndpoints(poly);
  strokes.push(strokes[0]);

  return strokes;
};
