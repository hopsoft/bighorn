// TODO: consider moving the tracking calls to a web worker
//       https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

var util                = require("./util");
var trackEventWithGA    = require("./trackers/google/ga");
var trackEventWithGAQ   = require("./trackers/google/gaq");
var trackEventWithPiwik = require("./trackers/piwik");
var trackEventWithAhoy  = require("./trackers/ahoy");

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

function track (category, action, label, value) {
  try {
    if (!util.isNumber(value)) { value = null; }
    trackEventWithGA(category, action, label, value);
    trackEventWithGAQ(category, action, label, value);
    trackEventWithPiwik(category, action, label, value);
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

