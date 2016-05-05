var util = require("../util");

module.exports = function (eventData) {
  var name     = "ahoy";
  var logLabel = "Bighorn.track ahoy";
  var tracker  = self[name];
  console.log("PRE", logLabel, eventData);

  try {
    if (!util.isObject(tracker)) {
      console.log("SKIP", logLabel, "tracker not found", eventData);
      return;
    }
    if (!util.isFunction(tracker.track)) {
      console.log("SKIP", logLabel, "track method not found", eventData);
      return;
    }
    if (!util.isValidString(eventData.name)) {
      console.log("SKIP", logLabel, "event name missing", eventData);
      return;
    }

    tracker.track(eventData.name, eventData);
    console.log("SUCCESS", logLabel, eventData);
  } catch (e) {
    console.log("ERROR", logLabel, e.message, eventData);
  }
};
