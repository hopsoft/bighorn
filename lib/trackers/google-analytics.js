var util = require("../util");

module.exports = function (category, action, label, value) {
  try {
    if (!util.isFunction(ga)) { return; }
    ga("send", "event", category, action, label, value);
    console.log("GA EVENT ->", "CATEGORY", category, "ACTION", action, "LABEL", label, "VALUE", value);
  } catch (e) {
    console.log("error", "trackEventWithGoogleAnalytics", e);
  }
};
