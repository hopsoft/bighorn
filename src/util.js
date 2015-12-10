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
