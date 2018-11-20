const test = require('tape');
const regularPolygon = require('regular-polygon');
const AlchemyAlgorithms = require('../alchemy-bundle');
const TestUtils = require('./test-utils');
const isFunction = TestUtils.isFunction;
const isCircle = TestUtils.isCircle;

test('Alchemy Algorithms - All Are Functions', t => {
  const alchemyFunctions = Object.entries(AlchemyAlgorithms);
  t.plan(alchemyFunctions.length);

  alchemyFunctions.forEach(kv_pair => {
    const name = kv_pair[0];
    const alchemy_fn = kv_pair[1];
    t.ok(isFunction(alchemy_fn), `Is Function : ${name}`);
  });
  t.end();
});

test('Alchemy Algorithms - Proper Forks Output', t => {
  const alchemyFunctions = Object.entries(AlchemyAlgorithms);
  const polygon_sides = 300;
  const center = [5, -1];
  const size = 10;
  const base_polygon = regularPolygon(polygon_sides, center, size);

 t.plan(alchemyFunctions.length);

  alchemyFunctions.forEach(kv_pair => {
    const name = kv_pair[0];
    const alchemy_fn = kv_pair[1];
    const result = alchemy_fn(base_polygon);
    t.ok(isCircle(result), `Fork Is Circle : ${name}`);
  });
  t.end();
});