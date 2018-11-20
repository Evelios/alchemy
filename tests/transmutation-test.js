const Transmutation = require('../transmutation');
const test = require('tape');
const TestUtils = require('./test-utils');
const isFunction = TestUtils.isFunction;

test('getAllAlgorithms : results are functions', t => {
  const startingAlgorithms = Transmutation.getAllAlgorithms();

  t.plan(startingAlgorithms.length);
  startingAlgorithms.forEach(algorithm => {
    t.ok(isFunction(algorithm));
  });
  t.end();
});