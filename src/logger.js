module.exports = {
  log: function () {
    var args = Array.prototype.slice.call(arguments);
    if ((args[0] != "SKIP") || self.Bighorn.debug) {
      console.log.apply(console, args);
    }
  }
};
