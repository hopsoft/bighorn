var util = require("./util");
var enumerable = require("./enumerable");

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

