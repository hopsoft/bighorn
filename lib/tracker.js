var util = require("./util");
var enumerable = require("./enumerable");
var kvn = require("./kvn");
var trackEventWithGoogleAnalytics = require("./trackers/google-analytics");
var trackEventWithPiwik = require("./trackers/piwik");
var trackEventWithAhoy = require("./trackers/ahoy");

function isValidString (value) {
  if (typeof(value) !== "string") { return false; }
  if (value.length === 0) { return false; }
  return true;
}

function isValidNumber (value) {
  return typeof(value) === "number";
}


// TODO: consider moving the tracking calls to a web worker
//       https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers


/*
 * Universal method for tracking events.
 * Publishes the event data to multiple backends.
 *
 * Supported backends (requires their JS to be included on the page):
 *   - Google Analytics
 *   - Piwik
 *   - Ahoy
 *
 * Method signature match's Google Analytics: https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 *   - Category [String] [Required] - Typically the object that was interacted with (e.g. button)
 *   - Action   [String] [Required] - The type of interaction (e.g. click)
 *   - Label    [String]            - Useful for categorizing events (e.g. nav buttons)
 *   - Value    [Number]            - Values must be non-negative. Useful to pass counts (e.g. 4 times)
 */
module.exports.track = function (category, action, label, value) {
  try {
    var args = [category, action, label];
    var stringArgs = enumerable.map(args, function (arg) {
      return String(util.isObject(arg) ? kvn(arg) : arg);
    });

    var stringCategory = stringArgs[0];
    var stringAction   = stringArgs[1];
    var stringLabel    = stringArgs[2];

    if (!isValidString(stringCategory)) { return; }
    if (!isValidString(stringAction)) { return; }
    if (!isValidNumber(value)) { value = null; }

    trackEventWithGoogleAnalytics(stringCategory, stringAction, stringLabel, value);
    trackEventWithPiwik(stringCategory, stringAction, stringLabel, value);
    trackEventWithAhoy(category, action, label, value);
  } catch (e) {
    console.log("error", "trackEvent", e);
  }
};

