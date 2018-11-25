const regularPolygon = require('regular-polygon');

module.exports = function circleStroke(poly) {

  let strokes = regularPolygon(
    poly.nsides,
    poly.center,
    poly.radius,
    poly.rotation
  );

  strokes.push(strokes[0]);

  return strokes;
};
