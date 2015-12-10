var util = require("../util");
var kvn = require("../kvn");

module.exports = function (category, action, label, value) {
  try {
    category = kvn(category);
    action   = kvn(action);
    label    = kvn(label);

    if (!util.isValidString(category)) { return; }
    if (!util.isValidString(action)) { return; }
    if (!util.isFunction(self.ga)) { return; }

    self.ga("send", "event", category, action, label, value);
    console.log("SUCCESS Bighorn.track ga", category, action, label, value);
  } catch (e) {
    console.log("ERROR Bighorn.track ga", category, action, label, value);
  }
};
