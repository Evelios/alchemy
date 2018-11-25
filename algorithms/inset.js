const Vector = require('vector');

module.exports = function inset(polygon, ammount=0.5, rotation=0) {
/**
 * Inset a polygon within another polygon by a particular ammount and rotation
 *
 * @returns {Vector[]} The inset polygon
 *
 */
    const center = Vector.avg(polygon);

    const base_radius = Vector.distance(polygon[0], center);
    const radius = base_radius * ammount;

    const base_rotation = Vector.angle(Vector.subtract(polygon[0], center));
    const inset_rotation = base_rotation + rotation;
    return regularPolygon(polygon.length, center, radius, inset_rotation);
};
