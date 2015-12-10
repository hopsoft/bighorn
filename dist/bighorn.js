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

	var util = __webpack_require__(2);
	var enumerable = __webpack_require__(3);
	var kvn = __webpack_require__(4);
	var trackEventWithGoogleAnalytics = __webpack_require__(5);
	var trackEventWithPiwik = __webpack_require__(6);
	var trackEventWithAhoy = __webpack_require__(7);

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



/***/ },
/* 2 */
/***/ function(module, exports) {

	function isObject (value) {
	  return typeof(value) === "object";
	}

	function isFunction (value) {
	  return typeof(value) === "function";
	}

	function isArray (value) {
	  return (value instanceof Array);
	}

	module.exports = {
	  isObject: isObject,
	  isFunction: isFunction,
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

	  return null;
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
	  merge: merge
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var enumerable = __webpack_require__(3);

	/**
	 * Converts a shallow object of key/value pairs into a single string value using "Key Value Notation" (KVN)
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
	module.exports = function (object) {
	  var keyValueDelim = ":";
	  var pairDelim = "; ";

	  var keys = enumerable.reduce(object, function (key, _, memo) {
	    memo.push(key);
	  }, []).sort();

	  var flattened = enumerable.map(keys, function (key) {
	    return String(key) + keyValueDelim + String(object[key]);
	  });

	  return flattened.join(pairDelim);
	};



/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	module.exports = function (category, action, label, value) {
	  try {
	    if (!util.isFunction(ga)) { return; }
	    ga("send", "event", category, action, label, value);
	    console.log("GA EVENT ->", "CATEGORY", category, "ACTION", action, "LABEL", label, "VALUE", value);
	  } catch (e) {
	    console.log("error", "trackEventWithGoogleAnalytics", e);
	  }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	module.exports = function (category, action, label, value) {
	  try {
	    if (!util.isObject(_paq) || !util.isFunction(_paq.push)) { return; }
	    _paq.push(["trackEvent", category, action, label, value]);
	    console.log("PIWIK EVENT ->", "CATEGORY", category, "ACTION", action, "LABEL", label, "VALUE", value);
	  } catch (e) {
	    console.log("error", "trackEventWithPiwik", e);
	  }
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

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


/***/ }
/******/ ]);