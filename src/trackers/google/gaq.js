var util = require("../../util");
var kvn = require("../../kvn");

module.exports = function (category, action, label, value) {
  try {
    category = kvn(category);
    action   = kvn(action);
    label    = kvn(label);

    if (!util.isValidString(category)) { return; }
    if (!util.isValidString(action)) { return; }
    if (!util.isObject(self._gaq) || !util.isFunction(self._gaq.push)) { return; }
    if (util.isFunction(self.ga)) { return; } // let ga manage the tracking

    self._gaq.push(["trackEvent", category, action, label, value]);
    console.log("SUCCESS Bighorn.track gaq", category, action, label, value);
  } catch (e) {
    console.log("ERROR Bighorn.track gaq", category, action, label, value, e.message);
  }
};
