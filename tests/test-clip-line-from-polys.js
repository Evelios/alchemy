#!/usr/bin/env node

const test = require('tape');

const clipLineFromPoly = require('../algorithms/clip-line-from-polys.js');
const circleStrokes = require('../algorithms/poly-strokes');
const polyStrokes = require('../algorithms/poly-strokes');

const deepAlmostEqual = function(t, actual, expected, msg) {
  if (isDeepAlmostEqual(actual, expected)) {
    t.pass(msg);
  } else {
    t.equal(actual, expected, msg);
  }
};

const isDeepAlmostEqual = function(actual, expected) {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length === expected.length) {
      for (let i = 0; i < actual.length; i++) {
        if(!isDeepAlmostEqual(actual[i], expected[i])) {
          return false;
        }
      }
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return almostEqual(actual, expected);
  }
};

const almostEqual = (a, b) => Math.abs(a - b) <= 10 * Number.EPSILON;

const poly = {
  center   : [1, 1],
  nsides   : 4,
  radius   : Math.sqrt(2),
  rotation : Math.PI / 4
};

const circle = {
  center : [1, 1],
  radius : 1
};

test('No Intersection', t => {
  const line = [ [-1, 3], [ 3, 3] ];
  const expected = [line];

  const polyClip = clipLineFromPoly(line, poly);
  const circleClip = clipLineFromPoly(line, circle);

  deepAlmostEqual(t, polyClip, expected, 'Polygon Clipping');
  deepAlmostEqual(t, circleClip, expected, 'Circle Clipping');
  t.end();
});

test('Double Intersection', t => {
  const line     = [ [-1, 1], [ 3, 1] ];
  const expected = [
    [ [-1, 1], [ 0, 1] ],
    [ [ 2, 1], [ 3, 1] ]
  ];

  const polyClip = clipLineFromPoly(line, poly);
  const circleClip = clipLineFromPoly(line, circle);

  deepAlmostEqual(t, polyClip, expected, 'Polygon Clipping');
  deepAlmostEqual(t, circleClip, expected, 'Circle Clipping');
  t.end();
});

test('Inside Polygon', t => {
  const line = [ [0.5, 1], [ 1.5, 1] ];
  const expected = [];

  const polyClip = clipLineFromPoly(line, poly);
  const circleClip = clipLineFromPoly(line, circle);

  deepAlmostEqual(t, polyClip, expected, 'Polygon Clipping');
  deepAlmostEqual(t, circleClip, expected, 'Circle Clipping');
  t.end();
});

test('Left Intersection', t => {
  const line     = [ [-1, 1], [ 1, 1] ];
  const expected = [[ [-1, 1], [ 0, 1] ]];

  const polyClip = clipLineFromPoly(line, poly);
  const circleClip = clipLineFromPoly(line, circle);

  deepAlmostEqual(t, polyClip, expected, 'Polygon Clipping');
  deepAlmostEqual(t, circleClip, expected, 'Circle Clipping');
  t.end();
});

test('Right Intersection', t => {
  const line     = [ [ 1, 1], [ 3, 1] ];
  const expected = [[ [ 2, 1], [ 3, 1] ]];

  const polyClip = clipLineFromPoly(line, poly);
  const circleClip = clipLineFromPoly(line, circle);

  deepAlmostEqual(t, polyClip, expected, 'Polygon Clipping');
  deepAlmostEqual(t, circleClip, expected, 'Circle Clipping');
  t.end();
});

test('All Cases', t => {
  const line = [
    [ -1,   1],
    [ -1,   3],
    [  1,   3],
    [  1, 1.5],
    [1.5, 1.5],
    [  3, 1.5],
    [  3, 0.5],
    [ -1, 0.5]
  ];

  const expected = [
    [
      [-1, 1],
      [-1, 3],
      [ 1, 3],
      [ 1, 2]
    ],
    [
      [ 2, 1.5],
      [ 3, 1.5],
      [ 3, 0.5],
      [ 2, 0.5]
    ],
    [
      [ 0, 0.5],
      [-1, 0.5]
    ]
  ];

  const polyClip = clipLineFromPoly(line, poly);

  deepAlmostEqual(t, polyClip, expected, 'Polygon Clipping');
  t.end();
});

test('Multiple Polygons', t => {
  const poly2 = {
    center   : [5, 1],
    nsides   : 4,
    radius   : Math.sqrt(2),
    rotation : Math.PI / 4
  };

  const circle2 = {
    center : [5, 1],
    radius : 1
  };

  const line = [
    [-1, 1],
    [ 1, 1],
    [ 3, 1],
    [ 7, 1]
  ];

  const expected = [
    [
      [-1, 1],
      [ 0, 1]
    ],
    [
      [ 2, 1],
      [ 3, 1],
      [ 4, 1]
    ],
    [
      [ 6, 1],
      [ 7, 1]
    ]
  ];

  const poly_clip = clipLineFromPoly(line, poly, poly2);
  const circle_clip = clipLineFromPoly(line, circle, circle2);

  deepAlmostEqual(t, poly_clip, expected, 'Polygon Clipping');
  deepAlmostEqual(t, circle_clip, expected, 'Circle Clipping');

  t.end();
});

test('Self Intersection', t => {
  const poly_stroke = polyStrokes(poly);
  const circle_stroke = circleStrokes(circle);

  const expected = [];

  const poly_clip = clipLineFromPoly(poly_stroke, poly);
  const circle_clip = clipLineFromPoly(circle_stroke, circle);

  deepAlmostEqual(t, poly_clip, expected, 'Polygon Clipping');
  deepAlmostEqual(t, circle_clip, expected, 'Circle Clipping');

  t.end();
});
