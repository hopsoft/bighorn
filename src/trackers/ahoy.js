var util = require("../util");
var enumerable = require("../enumerable");

module.exports = function (eventData) {
  var name     = "ahoy";
  var logLabel = "Bighorn.track ahoy";
  var tracker  = self[name];
  console.log("PRE", logLabel, tracker);

  try {
    if (!util.isObject(tracker)) { return; }
    if (!util.isFunction(tracker.track)) { return; }

    if (!util.isValidString(eventData.name)) {
      console.log("FAIL", eventData);
      return;
    }

    tracker.track(eventData.name, eventData);
    console.log("SUCCESS", eventData);
  } catch (e) {
    console.log("ERROR", eventData);
  }
};
