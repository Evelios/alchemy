module.exports = (function() {
  let self = {};

  self.getRendering = function(node) {
    let renderings = node.getRendering();    

    for (const child of node.children) {
      renderings.push(self.getRendering(child));
    }
    return renderings;
  };

  return self.getRendering;
})();