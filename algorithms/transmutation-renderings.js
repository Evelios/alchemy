const flattenLineTree = require('flatten-line-tree');
const createStroke = require('penplot-stroke');
const lerp = require('lerp');

module.exports = (function() {
  let self = {};

  self.main = function(root, options) {
    self.opts = options;
    self.leaf_nodes = self.getLeafNodes(root);
    self.max_depth = self.leaf_nodes.reduce((depth, leaf) => {
      return Math.max(depth, leaf.depth);
    }, 0);

    return self.getRendering(root);
  };

  self.getRendering = function(node) {
    const depth_ratio  = Math.pow(1 - node.depth / self.max_depth, 2);
    const line_width = lerp(self.opts.min_line_width, self.opts.max_line_width, depth_ratio);
    const lines = flattenLineTree(node.getRendering());
    const strokes = lines.map(line =>
      createStroke(line, line_width, self.opts.pen_width)
    );
    let renderings = [strokes];

    // let renderings = node.getRendering();

    for (const child of node.children) {
      renderings.push(self.getRendering(child));
    }
    return renderings;
  };

  self.getLeafNodes = function(node) {
    if (node.children.length > 0) {
      return node.children.reduce((leaves, child) => {
        return leaves.concat(self.getLeafNodes(child));
      }, []);
    }

    return node;
  };

  return self.main;
})();