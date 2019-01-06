const defaultOpts = require('default-options');
const Alea = require('alea');

const transmutationRenderings = require('./algorithms/transmutation-renderings');

module.exports = (function () {
  let self = {};

  self.main = function(options) {
    self.opts = self.parseOptions(options);
    self.rng = new Alea(self.opts.seed);

    const starting_poly = self.getStartingPoly();
    self.root = self.transmute(null, starting_poly);

    return transmutationRenderings(self.root, self.opts);
  };

  self.parseOptions = function(options) {
    const defaults = {
      // Sizing Parameters
      max_size            : undefined,
      min_size            : undefined,
      seed                : Math.random(),
      // Initial Conditions
      center              : undefined,
      starting_size       : undefined,
      nsides              : 6,
      rotation            : 0,
      // Options
      symmetric           : true,
      // Algorithms
      algorithms          : undefined,
      algorithm_selection : 'random',
      // Rendering Properties
      max_line_width      : undefined,
      min_line_width      : undefined,
      pen_width           : undefined,
    };

    return defaultOpts(options, defaults);
  };

  self.getStartingPoly = function() {
    return {
      center   : self.opts.center,
      radius   : self.opts.starting_size,
      nsides   : self.opts.nsides,
      rotation : self.opts.rotation,
    };
  };

  self.transmute = function(parent, polygon, algorithm) {
    const next_algorithm = algorithm || self.getNextAlgorithm();
    const current_transmutation = new next_algorithm(parent, polygon, {
      rng : parent ? parent.getChildRng() : new Alea(self.rng())
    });

    self.transmuteInterior(current_transmutation);
    self.transmuteForks(current_transmutation);

    return current_transmutation;
  };

  self.transmuteInterior = function(current_transmutation) {
    const interior = current_transmutation.getInterior();

    if (!self.isInteriorContinuation(interior)) return;

    const next_algorithm = self.getNextAlgorithm(current_transmutation);

    const child = self.transmute(current_transmutation, interior, next_algorithm);
    current_transmutation.addChild(child);
  }

  self.transmuteForks = function(current_transmutation) {
    const forks = current_transmutation.getForks();

    if (!self.isForkingContinuation(forks)) return;

    const continuations = forks.filter(c => c.radius > self.opts.min_size);
    const child_algorithm = self.opts.symmetric
      ? self.getNextAlgorithm(current_transmutation)
      : undefined;

    for (const continuation_poly of continuations) {
      const child = self.transmute(
        current_transmutation,
        continuation_poly,
        child_algorithm
      );
      current_transmutation.addChild(child);
    }
  }

  // ---- Filtering Functions --------------------------------------------------

  self.isInteriorContinuation = function(interior) {
    return interior && interior.radius > self.opts.min_size;
  };

  self.isForkingContinuation = function(forks) {
    return forks && forks.length > 0;
  };

  // ---- Algorithm Selection --------------------------------------------------

  self.getNextAlgorithm = function(parent) {
    switch (self.opts.algorithm_selection) {
      case 'random':
        return self.getRandomAlgorithm(parent);
        break;

      default:
        throw new Error(`Value Error : Invalid Algorithm Selection Value ${self.opts.algorithm_selection}`);
        break;
    }
  };

  self.getRandomAlgorithm = function(parent) {
    const rng = parent ? parent.opts.rng : self.rng;
    const randInt = (min, max) => min + Math.floor(rng() * (max - min + 1));

    const algorithm_index = randInt(0, self.opts.algorithms.length - 1);
    return self.opts.algorithms[algorithm_index];
  };

  return self.main;
})();
