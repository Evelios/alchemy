const Transmutation = require('../transmutation');
const test = require('tape');


const isFunction = obj => {
  return obj && {}.toString.call(obj) === '[object Function]';
}

test('getAllAlgorithms : results are functions', t => {
  const startingAlgorithms = Transmutation.getAllAlgorithms();

  t.plan(startingAlgorithms.length);
  startingAlgorithms.forEach(algorithm => {
    t.ok(isFunction(algorithm));
  });
  t.end();
});