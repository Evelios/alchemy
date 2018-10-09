const test = require('tape');
const Transmutation = require('./transmutation');

const isFunction = obj => {
  return obj && {}.toString.call(obj) === '[object Function]';
};

const isPoint = obj => {
  return Array.isArray(obj) && !isNaN(obj[0]) && !isNaN(obj[1]);
};

const isPolygon = obj => {
  return Array.isArray(obj) &&
    obj.reduce((acc, cur) => acc && isPoint(cur), true);
};

test('getAllAlgorithms - All functions', t => {
  const algorithms = Transmutation.getAllAlgorithms();

  t.plan(algorithms.length);
  algorithms.forEach(alg =>  {
    t.ok(isFunction(alg));
  });
  t.end();
});

test('getNextAlgorithm - In All Algorithms', t => {
  const algorithms = Transmutation.getAllAlgorithms();
  const next_algorithm = Transmutation.getNextAlgorithm();

  const passed = algorithms.reduce((acc, cur) => {
    return acc || next_algorithm === cur;
  });
  t.ok(passed);
  t.end();
});

test('randInt - In Range', t => {
  const num_tests = 10;

  t.plan(num_tests);
  for (let i = 0; i < num_tests; i++) {
    const min = 10;
    const max = 15;
    const selection = Transmutation.randInt(min, max);
    const in_range = selection >= min && selection <= max;
    t.ok(in_range, `Value: ${selection}`);
  }
  t.end();
});

test('getPolygonCircle - Is Polygon', t => {
  const size = 5;
  const center = [1, 3];
  const poly_circle = Transmutation.getPolygonCircle(center, size);

  t.ok(isPolygon(poly_circle));
  t.end();
});

test('getPolygonCircle & polygonSize - Is Particular Size', t => {
  const size = 5;
  const center = [1, 3];
  const poly_circle = Transmutation.getPolygonCircle(center, size);

  t.equals(Transmutation.polygonSize(poly_circle), size, 'Sizes Match');
  t.end();
});