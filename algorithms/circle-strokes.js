const regularPolygon = require('regular-polygon');

module.exports = function(circle) {
  const N_CIRCLE_SIDES = 300;

  let strokes = regularPolygon(
    N_CIRCLE_SIDES,
    circle.center,
    circle.radius,
  );

  strokes.push(strokes[0]);

  return strokes;
};
