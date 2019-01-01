const segmentIntersection = require('line-segment-intersection');
const flattenLineTree = require('flatten-line-tree');
const array = require('new-array');
const Vector = require('vector');

const circleStrokes = require('./circle-strokes');
const polyStrokes = require('./poly-strokes');
const polyEndpoints = require('./polygon-endpoints');

module.exports = (function() {
  let self = {};

  self.clipLineFromPolygons = function(stroke, ...polys) {
    return polys.reduce((strokes, poly) => {
      return flattenLineTree(strokes.map(stroke => {
        return self.clipLineFromPoly(stroke, poly);
      }));
    }, [stroke]);
  };

  self.clipLineFromPoly = function(stroke, poly) {
  /**
   * Get the resulting stroke after it has been intersected by a regular polygon
   * This result can be multiple strokes after the origional stroke has been
   * broken up by the polygon.
   *
   * @param {Stroke} stroke The stroke line that is getting clipped
   * @param {Polygon} ...polys The clipping polygons
   *
   * @returns {Stroke[]} The resulting stroke after clipping
   */
    const stroke_segments = self.getSegments(stroke);
    let current_stroke = [];
    let out_strokes = [];

    stroke_segments.forEach((seg, i, segs) => {
      const intersections = self.getLinePolyIntersections(seg, poly);
      const v0 = seg[0];
      const v1 = seg[1];
      const v0_in_poly = self.pointInPoly(v0, poly);
      const v1_in_poly = self.pointInPoly(v1, poly);

      if (!v0_in_poly) {
        current_stroke.push(v0);
      }

      if ((!v0_in_poly || !v1_in_poly) && intersections.length !== 0) {
        current_stroke.push(intersections[0]);

        if (current_stroke.length > 1) {
          out_strokes.push(current_stroke);
          current_stroke = intersections.length === 1 ? [] : [intersections[1]];
        }
      }

      if (i === segs.length - 1 && !v1_in_poly) {
        current_stroke.push(v1);
      }
    });

    if (current_stroke.length > 0) {
      out_strokes.push(current_stroke);
    }
    
    return out_strokes;
  };

  self.getLinePolyIntersections = function(line, obj) {
    const intersections = self.getPolySegments(obj)
      .map(seg => segmentIntersection(line, seg))
      .filter(intersection => intersection .length > 0)
      .sort((a, b) => Vector.distance(line[0], a) - Vector.distance(line[0], b));

    return intersections;
  };

  self.getPolySegments = function(obj) {
    const strokes = self.getPolyStroke(obj);
    return self.getSegments(strokes);
  }

  self.getSegments = function(strokes) {
    return array(strokes.length - 1).map((_, i) => {
      return [ strokes[i], strokes[i + 1] ]
    });
  }

  self.getPolyStroke = function(obj) {
    if (self.isPolygon(obj)) {
      return polyStrokes(obj);
    }
    else if (self.isCircle(obj)) {
      return circleStrokes(obj);
    }
    else {
      throw Error('Unknown object type. Neither circle nor polygon');
    }
  }

  self.isPolygon = function(obj) {
    return self.isCircle(obj) &&
           obj.nsides   !== undefined &&
           obj.rotation !== undefined;
  };

  self.isCircle = function(obj) {
    return obj.center !== undefined && obj.radius !== undefined;
  }

  self.pointInPoly = function(point, obj) {
    if (self.isPolygon(obj)) {
      return self.pointInPolygon(point, obj);
    }
    else if (self.isCircle(obj)) {
      return self.pointInCircle(point, obj);
    }
    else {
      throw Error('Unknown object type. Neither circle nor polygon');
    }
  }

  self.pointInPolygon = function(point, poly) {
    const angle_sum = polyEndpoints(poly).reduce((acc, vertex, i, verts) => {
      const next_vertex = verts[(i + 1) % verts.length];
      const vector1 = Vector.subtract(vertex, point);
      const vector2 = Vector.subtract(next_vertex, point);
      return acc + Vector.angleBetween(vector1, vector2);
    }, 0);

    return Math.abs(angle_sum - 2*Math.PI) < Number.EPSILON * 10;
  }

  self.pointInCircle = function(point, circle) {
    return Vector.distance(point, circle.center) < circle.radius;
  }

  return self.clipLineFromPolygons;
})();
