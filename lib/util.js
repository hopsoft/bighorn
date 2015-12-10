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
