var util = require("../../util");
var kvn = require("../../kvn");

var formatEventData = function (eventData) {
  return {
    category: kvn({ target: eventData.target }),
    action: kvn(eventData),
    label: kvn({ name: eventData.name }),
    value: eventData.value
  };
};

module.exports = function (eventData) {
  var name     = "_gaq";
  var logLabel = "Bighorn.track google _gaq";
  var tracker  = self[name];
  console.log("PRE", logLabel, eventData);

  try {
    var data = formatEventData(eventData);

    if (!util.isObject(tracker)) {
      console.log("SKIP", logLabel, "tracker not found", eventData);
      return;
    }
    if (!util.isFunction(tracker.push)) {
      console.log("SKIP", logLabel, "push method not found", eventData);
      return;
    }
    if (util.isFunction(self.ga)) {
      console.log("SKIP", logLabel, "defer tracking to ga", eventData);
      return;
    }
    if (!util.isValidString(category)) {
      console.log("SKIP", logLabel, "category not valid", eventData);
      return;
    }
    if (!util.isValidString(action)) {
      console.log("SKIP", logLabel, "action not valid", eventData);
      return;
    }

    tracker.push(["trackEvent", data.category, data.action, data.label, data.value]);
    console.log("SUCCESS", logLabel, eventData);
  } catch (e) {
    console.log("ERROR", logLabel, e.message, eventData);
  }
};
