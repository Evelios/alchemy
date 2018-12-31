const clipLineFromPoly = require('../algorithms/clip-line-from-poly.js');
const test = require('tape');

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
