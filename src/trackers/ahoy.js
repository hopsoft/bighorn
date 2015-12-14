var util = require("../util");
var enumerable = require("../enumerable");

module.exports = function (category, action, label, value) {
  var name     = "ahoy";
  var logLabel = "Bighorn.track ahoy";
  var tracker  = self[name];

  console.log("PRE", logLabel, tracker);

  try {
    if (!util.isObject(tracker) || !util.isFunction(tracker.track)) { return; }

    var data = {
      category: category,
      action: action,
      label: label,
      value: value
    };

    var properties = {};

    enumerable.each(data, function (key, value) {
      if (util.isObject(value)) {
        enumerable.merge(properties, value);
      } else {
        properties[key] = value;
      }
    });

    var eventName = properties.name || label;
    tracker.track(eventName, properties);
    console.log("SUCCESS", logLabel, category, action, label, value);
  } catch (e) {
    console.log("ERROR", logLabel, category, action, label, value);
  }
};
