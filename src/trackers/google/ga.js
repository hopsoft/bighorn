var util = require("../../util");
var kvn = require("../../kvn");
var logger = require("../../logger");

var formatEventData = function (eventData) {
  return {
    category: kvn({ target: eventData.target }),
    action: kvn(eventData),
    label: kvn({ name: eventData.name }),
    value: eventData.value
  };
};

module.exports = function (eventData) {
  var name     = "ga";
  var logLabel = "Bighorn.track google ga";
  var tracker  = self[name];

  try {
    var data = formatEventData(eventData);

    if (!util.isFunction(tracker)) {
      logger.log("SKIP", logLabel, "tracker not found", eventData);
      return;
    }
    if (!util.isValidString(category)) {
      logger.log("SKIP", logLabel, "category not valid", eventData);
      return;
    }
    if (!util.isValidString(action)) {
      logger.log("SKIP", logLabel, "action not valid", eventData);
      return;
    }

    tracker("send", "event", data.category, data.action, data.label, data.value);
    logger.log("SUCCESS", logLabel, eventData);
  } catch (e) {
    logger.log("ERROR", logLabel, e.message, eventData);
  }
};
