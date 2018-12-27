const defaultOpts = require('default-options');
const transmutationRenderings = require('./algorithms/transmutation-renderings');

module.exports = (function () {
  let self = {};

  self.main = function(options) {
    self.opts = self.parseOptions(options);

    const starting_poly = self.getStartingPoly();
    self.root = self.transmute(null, starting_poly);

    return transmutationRenderings(self.root, self.opts);
  };

  self.parseOptions = function(options) {
    const defaults = {
      center              : undefined,
      starting_size       : undefined,
      max_size            : undefined,
      min_size            : undefined,
      algorithms          : undefined,
      algorithm_selection : 'random',
      nsides              : 6,
      rotation            : 0,
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

  self.transmute = function(parent, polygon) {
    const next_algorithm = self.getNextAlgorithm();
    const current_transmutation = new next_algorithm(parent, polygon);

    const interior = current_transmutation.getInterior();
    if (self.isInteriorContinuation(interior)) {
      const child = self.transmute(current_transmutation, interior);
      current_transmutation.addChild(child);
    }

    const forks = current_transmutation.getForks();
    if (self.isForkingContinuation(forks)) {
      const continuations = forks.filter(c => c.radius > self.opts.min_size);
      for (const continuation_poly of continuations) {
        const child = self.transmute(current_transmutation, continuation_poly);
        current_transmutation.addChild(child);
      }
    }

    return current_transmutation;
  };

  // ---- Filtering Functions --------------------------------------------------

  self.isInteriorContinuation = function(interior) {
    return interior && interior.radius > self.opts.min_size;
  };

  self.isForkingContinuation = function(forks) {
    return forks && forks.length > 0;
  };

  // ---- Algorithm Selection --------------------------------------------------

  self.getNextAlgorithm = function() {
    switch (self.opts.algorithm_selection) {
      case 'random':
        return self.getRandomAlgorithm();

      default:
        throw new Error(`Value Error : Invalid Algorithm Selection Value ${self.opts.algorithm_selection}`);
    }
  };

  self.getRandomAlgorithm = function() {
    const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    return self.opts.algorithms[randInt(0, self.opts.algorithms.length - 1)];
  };

  return self.main;
})();
