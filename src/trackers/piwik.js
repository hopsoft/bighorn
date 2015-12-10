var util = require("../util");
var kvn = require("../kvn");

module.exports = function (category, action, label, value) {
  try {
    category = kvn(category);
    action   = kvn(action);
    label    = kvn(label);

    if (!util.isValidString(category)) { return; }
    if (!util.isValidString(action)) { return; }
    if (!util.isObject(self._paq) || !util.isFunction(self._paq.push)) { return; }

    self._paq.push(["trackEvent", category, action, label, value]);
    console.log("SUCCESS Bighorn.track piwik", category, action, label, value);
  } catch (e) {
    console.log("ERROR Bighorn.track piwik", category, action, label, value, e.message);
  }
};
