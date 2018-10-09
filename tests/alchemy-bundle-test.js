const test = require('tape');
const regularPolygon = require('regular-polygon');
const AlchemyAlgorithms = require('../alchemy-bundle');

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

const isCircle = obj => {
  return obj.hasOwnProperty('radius') &&
         obj.hasOwnProperty('center') &&
         isPoint(obj.center);

};

test('Alchemy Algorithms - All Are Functions', t => {
  const alchemyFunctions = Object.entries(AlchemyAlgorithms).map(kv_pair => kv_pair[1]);

  t.plan(alchemyFunctions.length);
  alchemyFunctions.forEach(alg => {
    t.ok(isFunction(alg), 'Algorithm Is Function');
  });
  t.end();
});

test('Alchemy Algorithms - Proper Forks Output', t => {
  const alchemyFunctions = Object.entries(AlchemyAlgorithms).map(kv_pair => kv_pair[1]);
  const polygon_sides = 300;
  const center = [5, -1];
  const size = 10;
  const base_polygon = regularPolygon(polygon_sides, center, size);

  t.plan(alchemyFunctions.length);
  alchemyFunctions.forEach(alg => {
    const result = alg(base_polygon);
    isCircle(result);
  });
  t.end();
});