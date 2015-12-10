var enumerable = require("./enumerable");

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

