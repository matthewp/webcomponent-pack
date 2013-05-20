
module.exports = function(arr) {
  return arr.reduce(function(a, b) {
    return a.concat(b);
  });
};
