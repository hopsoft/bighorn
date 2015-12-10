var util = require("../util");

module.exports = function (category, action, label, value) {
  try {
    if (!util.isObject(ahoy) || !util.isFunction(ahoy.track)) { return; }
    var data = { category: category, action: action, label: label, value: value };
    var properties = {};
    each(data, function (key, value) {
      if (util.isObject(value)) {
        merge(properties, value);
      } else {
        properties[key] = value;
      }
    });
    var name = properties.name || label;
    ahoy.track(name, properties);
    console.log("AHOY EVENT ->", name, properties);
  } catch (e) {
    console.log("error", "trackEventWithAhoy", e);
  }
};
