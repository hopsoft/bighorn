var util = require("./util");

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
      if (value === null || typeof(value) === "undefined") {
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
