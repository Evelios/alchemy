const flattenLineTree = require('flatten-line-tree');
const polygonClipping = require('polygon-clipping');
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
    const clipping_polys = self.getClippingPolygons(node);
    let lines = flattenLineTree(node.getRendering());

    if (clipping_polys.length > 0) {
        // lines = lines.map(line => polygonClipping.difference(line, ...clipping_polys));
    }

    const strokes = lines.map(line =>
      createStroke(line, line_width, self.opts.pen_width)
    );
    let renderings = [strokes];

    for (const child of node.children) {
      renderings.push(self.getRendering(child));
    }
    return renderings;
  };

  self.getClippingPolygons = function(node) {
    return self.getAllChildren(node)
      .map(child => child.getClipping())
      .filter(poly => poly !== null);
  };

  self.getChildren = function(node) {
    return node.children;
  };

  self.getAllChildren = function(node) {
  // Get a list of all the children under the current node
    const has_grandchildren = node.children.filter(child => child.hasChildren());

    if (has_grandchildren.length > 0) {
      return node.children.concat(
        has_grandchildren.reduce((acc, child) => {
          return acc.concat(self.getAllChildren(child));
        }, []) 
      );
    }
    else {
      return node.children;
    }


    // if (children.length > 0) {
    //   const grandchildren = children.map(child => self.getAllChildren(child));
    //   if (grandchildren.length > 0) {
    //     return children.concat(grandchildren);
    //   }
    //   else {
    //     return children;
    //   }
    // }
  };

  self.getLeafNodes = function(node) {
  // Get all the leaf nodes that are unter the current node
    if (node.children.length > 0) {
      return node.children.reduce((leaves, child) => {
        return leaves.concat(self.getLeafNodes(child));
      }, []);
    }

    return node;
  };

  return self.main;
})();