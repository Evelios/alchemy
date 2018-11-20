module.exports = (function() {

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

  return {
    isFunction,
    isPoint,
    isPolygon,
    isCircle
  }
})();