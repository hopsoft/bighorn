// TODO: consider moving the tracking calls to a web worker
//       https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

var tv4                = require("tv4");
var eventSchema        = require("json!./event-schema.json");
var util               = require("./util");
var enumerable         = require("./enumerable");
var trackEventWithGA   = require("./trackers/google/ga");
var trackEventWithGAQ  = require("./trackers/google/gaq");
var trackEventWithPAQ  = require("./trackers/piwik/paq");
var trackEventWithAhoy = require("./trackers/ahoy");

var validate = function (data, schema) {
  var result = tv4.validateMultiple(data, schema);
  if (!result.valid) {
    data.validation_errors = enumerable.map(result.errors, function (e) {
      var error = {};
      error.property = e.params.key;
      error.property = error.property || e.dataPath.replace(/\//, "");
      error.message = e.message;
      return error;
    });
    console.log("WARNING", "Bighorn.validate", "Schema validation failed!", data);
  }
};

/*
 * Universal method for tracking events.
 * Publishes the event data to multiple backends.
 *
 * Supported backends (requires their JS to be included on the page):
 *   - Google Analytics
 *   - Piwik
 *   - Ahoy
 *
 * eventData must adhere to the schema definition at: src/eventSchema.js
 */

function track (eventData) {
  try {
    eventData = enumerable.removeNullAndUndefinedValues(eventData);
    validate(eventData, eventSchema);
    trackEventWithGA(eventData);
    trackEventWithGAQ(eventData);
    trackEventWithPAQ(eventData);
    trackEventWithAhoy(eventData);
  } catch (e) {
    console.log("ERROR", "Bighorn.track", e);
  }
}

if (util.isFunction(self.define) && self.define.amd) {
  self.define("bighorn", [], function() {
    return { track: track };
  });
}

module.exports.validate = validate;
module.exports.track = track;
