var util = require("../util");
var enumerable = require("../enumerable");

module.exports = function (category, action, label, value) {
  var logLabel = "Bighorn.track customBackend";
  var backendUrl  = Bighorn.customUrl;

  console.log("PRE", logLabel, backendUrl);

  try {
    if (!util.isValidString(backendUrl)) { return; }

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

    var xhr = new XMLHttpRequest();
    xhr.open("POST", backendUrl, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(properties));
    console.log("SUCCESS", logLabel, category, action, label, value);
  } catch (e) {
    console.log("ERROR", logLabel, category, action, label, value);
  }
}
