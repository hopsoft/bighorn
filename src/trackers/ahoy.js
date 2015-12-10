var util = require("../util");
var enumerable = require("../enumerable");

module.exports = function (category, action, label, value) {
  try {
    if (!util.isObject(self.ahoy) || !util.isFunction(self.ahoy.track)) { return; }

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

    var name = properties.name || label;
    self.ahoy.track(name, properties);
    console.log("SUCCESS Bighorn.track ahoy", category, action, label, value);
  } catch (e) {
    console.log("ERROR Bighorn.track ahoy", category, action, label, value);
  }
};
