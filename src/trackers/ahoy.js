var util = require("../util");
var logger = require("../logger");

module.exports = function (eventData) {
  var name     = "ahoy";
  var logLabel = "Bighorn.track ahoy";
  var tracker  = self[name];

  try {
    if (!util.isObject(tracker)) {
      if (self.Bighorn.debug) {
        logger.log("SKIP", logLabel, "tracker not found", eventData);
      }
      return;
    }
    if (!util.isFunction(tracker.track)) {
      logger.log("SKIP", logLabel, "track method not found", eventData);
      return;
    }
    if (!util.isValidString(eventData.name)) {
      logger.log("SKIP", logLabel, "event name missing", eventData);
      return;
    }

    tracker.track(eventData.name, eventData);
    logger.log("SUCCESS", logLabel, eventData);
  } catch (e) {
    logger.log("ERROR", logLabel, e.message, eventData);
  }
};
