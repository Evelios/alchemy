const Vector = require('vector');

module.exports = function(poly) {
/**
 * Inscribe a regular polygon inside another regular polygon. The new polygon
 * will have the same number of sides as the origional and will be rotated so
 * that the endpoints of the inner polygon touch the midpoints of the outer
 * polygon.
 * 
 * @param {Polygon} The polygon to inscribe inside 
 * @returns {Polygon} The inscribed polygon
 */
  const rotation = poly.rotation + Math.PI / poly.nsides;
  const inset_ammount = poly.radius * Math.cos(Math.PI / poly.nsides);

  return {
    center   : poly.center,
    radius   : inset_ammount,
    rotation : rotation,
    nsides   : poly.nsides
  }
};
