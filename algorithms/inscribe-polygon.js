const Vector = require('vector');
const intset = require('./inset.js');

module.exports = function inscribePolygon(polygon) {
/**
 * Inscribe a regular polygon inside another regular polygon. The new polygon
 * will have the same number of sides as the origional and will be rotated so
 * that the endpoints of the inner polygon touch the midpoints of the outer
 * polygon.
 * 
 * @returns {Vector[]} The inscribed polygon
 */
  const nsides = polygon.length;
  const center = Vector.avg(polygon);

  const rotation = Math.PI / nsides;
  const inset_ammount = Math.cos(Math.PI / nsides);

  return inset(polygon, inset_ammount, rotation);
};
