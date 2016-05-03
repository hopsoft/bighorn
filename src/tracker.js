// TODO: consider moving the tracking calls to a web worker
//       https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

var tv4                = require("tv4");
var eventSchema        = require("./eventSchema");
var util               = require("./util");
var enumerable         = require("./enumerable");
var trackEventWithGA   = require("./trackers/google/ga");
var trackEventWithGAQ  = require("./trackers/google/gaq");
var trackEventWithPAQ  = require("./trackers/piwik/paq");
var trackEventWithAhoy = require("./trackers/ahoy");

var validate = function (eventData) {
  var validationResult = tv4.validateMultiple(eventData, eventSchema);
  if (!validationResult.valid) {
    eventData.validationErrors = enumerable.map(validationResult.errors, function (e) {
      return e.message;
    });
    console.log("WARNING", "Bighorn.validate", "Schema validation failed!", eventData);
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
    validate(eventData);
    // TODO: update backends to work with eventData

    if (!util.isNumber(value)) { value = null; }

    category = enumerable.removeNullAndUndefinedValues(category);
    action   = enumerable.removeNullAndUndefinedValues(action);
    label    = enumerable.removeNullAndUndefinedValues(label);

    trackEventWithGA(category, action, label, value);
    trackEventWithGAQ(category, action, label, value);
    trackEventWithPAQ(category, action, label, value);
    trackEventWithAhoy(category, action, label, value);
  } catch (e) {
    console.log("ERROR", "Bighorn.track", e);
  }
}

if (util.isFunction(self.define) && self.define.amd) {
  self.define("bighorn", [], function() {
    return { track: track };
  });
}

module.exports.track = track;

