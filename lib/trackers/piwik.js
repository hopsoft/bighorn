var util = require("../util");

module.exports = function (category, action, label, value) {
  try {
    if (!util.isObject(_paq) || !util.isFunction(_paq.push)) { return; }
    _paq.push(["trackEvent", category, action, label, value]);
    console.log("PIWIK EVENT ->", "CATEGORY", category, "ACTION", action, "LABEL", label, "VALUE", value);
  } catch (e) {
    console.log("error", "trackEventWithPiwik", e);
  }
};
