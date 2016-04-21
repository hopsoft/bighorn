/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Bighorn"] = __webpack_require__(1);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// TODO: consider moving the tracking calls to a web worker
	//       https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

	var util               = __webpack_require__(2);
	var enumerable         = __webpack_require__(3);
	var trackEventWithGA   = __webpack_require__(4);
	var trackEventWithGAQ  = __webpack_require__(6);
	var trackEventWithPAQ  = __webpack_require__(7);
	var trackEventWithAhoy = __webpack_require__(8);
	var trackEventWithCustom = __webpack_require__(9)

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

	    category = enumerable.removeNullAndUndefinedValues(category);
	    action   = enumerable.removeNullAndUndefinedValues(action);
	    label    = enumerable.removeNullAndUndefinedValues(label);

	    trackEventWithGA(category, action, label, value);
	    trackEventWithGAQ(category, action, label, value);
	    trackEventWithPAQ(category, action, label, value);
	    trackEventWithAhoy(category, action, label, value);
	    trackEventWithCustom(category, action, label, value);
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



/***/ },
/* 2 */
/***/ function(module, exports) {

	function isObject (value) {
	  return (typeof value === "object");
	}

	function isFunction (value) {
	  return (typeof value === "function");
	}

	function isNumber (value) {
	  return (typeof value === "number");
	}

	function isString (value) {
	  return (typeof value === "string");
	}

	function isValidString (value) {
	  if (!isString(value)) { return false; }
	  if (value.replace(/\s/g, "").length === 0) { return false; }
	  return true;
	}

	function isArray (value) {
	  return (value instanceof Array);
	}

	module.exports = {
	  isObject: isObject,
	  isFunction: isFunction,
	  isString: isString,
	  isValidString: isValidString,
	  isNumber: isNumber,
	  isArray: isArray
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	function eachWithArray(object, callback) {
	  for (var i in object) {
	    callback(object[i]);
	  }
	}

	function eachWithObject(object, callback) {
	  for (var key in object) {
	    if (object.hasOwnProperty(key)) {
	      callback(key, object[key]);
	    }
	  }
	}

	function each (object, callback) {
	  if (util.isArray(object)) {
	    return eachWithArray(object, callback);
	  }

	  if (util.isObject(object)) {
	    return eachWithObject(object, callback);
	  }
	}

	function map (list, callback) {
	  var memo = [];
	  each(list, function (item) {
	    memo.push(callback(item));
	  });
	  return memo;
	}

	function reduceWithArray (object, callback, memo) {
	  each(object, function (item) {
	    callback(item, memo);
	  });
	  return memo;
	}

	function reduceWithObject (object, callback, memo) {
	  each(object, function (key, value) {
	    callback(key, value, memo);
	  });
	  return memo;
	}

	function reduce (object, callback, memo) {
	  if (util.isArray(object)) {
	    return reduceWithArray(object, callback, memo);
	  }

	  if (util.isObject(object)) {
	    return reduceWithObject(object, callback, memo);
	  }

	  return object;
	}

	function removeNullAndUndefinedValues (object) {
	  if (util.isArray(object)) {
	    return reduceWithArray(object, function (value, memo) {
	      if (value === null || typeof(value) === "undefined") {
	        memo.push(value);
	      }
	    }, []);
	  }

	  if (util.isObject(object)) {
	    return reduceWithObject(object, function (key, value, memo) {
	      if (value !== null && typeof(value) !== "undefined") {
	        memo[key] = value;
	      }
	    }, {});
	  }

	  return object;
	}

	function merge () {
	  var args = Array.prototype.slice.call(arguments);
	  var first = args.shift();
	  return reduce(args, function (object, memo) {
	    each(object, function (key, value) {
	      first[key] = value;
	    });
	  }, first);
	}

	module.exports = {
	  each: each,
	  map: map,
	  reduce: reduce,
	  merge: merge,
	  removeNullAndUndefinedValues: removeNullAndUndefinedValues
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var kvn = __webpack_require__(5);

	module.exports = function (category, action, label, value) {
	  var name     = "ga";
	  var logLabel = "Bighorn.track google ga";
	  var tracker  = self[name];

	  console.log("PRE", logLabel, tracker);

	  try {
	    category = kvn(category);
	    action   = kvn(action);
	    label    = kvn(label);

	    if (!util.isValidString(category)) { return; }
	    if (!util.isValidString(action)) { return; }
	    if (!util.isFunction(tracker)) { return; }

	    tracker("send", "event", category, action, label, value);
	    console.log("SUCCESS", logLabel, category, action, label, value);
	  } catch (e) {
	    console.log("ERROR", logLabel, category, action, label, value);
	  }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var enumerable = __webpack_require__(3);

	var keyValueDelim = ":";
	var pairDelim = "; ";
	var reservedPattern = new RegExp(keyValueDelim + "|" + pairDelim, "g");

	/**
	 * Converts a value into a KVN (Key Value Notation) string value
	 * KVN stores key/value pairs as a string... think of it as a subset of JSON
	 *
	 * NOTE: Keys are sorted alphabetically
	 *
	 * Example:
	 *   { a: true, b: 1, c: "example", d: "example with whitespace" }
	 *
	 *   // produces
	 *
	 *   "a:true; b:1; c:example; d:example with whitespace;"
	 *
	 * IMPORTANT: Colons & semicolons are prohibited from use in keys and values
	 */
	module.exports = function (value) {
	  if (!util.isObject(value)) {
	    return String(value);
	  }

	  var keys = enumerable.reduce(value, function (key, _, memo) {
	    memo.push(key);
	  }, []).sort();

	  var flattened = enumerable.map(keys, function (key) {
	    return String(key).replace(reservedPattern, "") + keyValueDelim + String(value[key]).replace(reservedPattern, "");
	  });

	  return flattened.join(pairDelim);
	};



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var kvn = __webpack_require__(5);

	module.exports = function (category, action, label, value) {
	  var name     = "_gaq";
	  var logLabel = "Bighorn.track google _gaq";
	  var tracker  = self[name];

	  console.log("PRE", logLabel, tracker);

	  try {
	    category = kvn(category);
	    action   = kvn(action);
	    label    = kvn(label);

	    if (!util.isValidString(category)) { return; }
	    if (!util.isValidString(action)) { return; }
	    if (!util.isObject(tracker) || !util.isFunction(tracker.push)) { return; }
	    if (util.isFunction(self.ga)) { return; } // let ga manage the tracking

	    tracker.push(["trackEvent", category, action, label, value]);
	    console.log("SUCCESS", logLabel, category, action, label, value);
	  } catch (e) {
	    console.log("ERROR", logLabel, category, action, label, value);
	  }
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var kvn = __webpack_require__(5);

	module.exports = function (category, action, label, value) {
	  var name     = "_paq";
	  var logLabel = "Bighorn.track piwik _paq";
	  var tracker  = self[name];

	  console.log("PRE", logLabel, tracker);

	  try {
	    category = kvn(category);
	    action   = kvn(action);
	    label    = kvn(label);

	    if (!util.isValidString(category)) { return; }
	    if (!util.isValidString(action)) { return; }
	    if (!util.isObject(tracker) || !util.isFunction(tracker.push)) { return; }

	    tracker.push(["trackEvent", category, action, label, value]);
	    console.log("SUCCESS", logLabel, category, action, label, value);
	  } catch (e) {
	    console.log("ERROR", logLabel, category, action, label, value);
	  }
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var enumerable = __webpack_require__(3);

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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var enumerable = __webpack_require__(3);

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


/***/ }
/******/ ]);