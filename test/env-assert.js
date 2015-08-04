var assert = require("assert");

assert.inDelta = function(actual, expected, delta, message) {
  if (!inDelta(actual, expected, delta)) {
    assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDelta);
  }
};

function inDelta(actual, expected, delta) {
  return (Array.isArray(expected) ? inDeltaArray : inDeltaNumber)(actual, expected, delta);
}

function inDeltaArray(actual, expected, delta) {
  var n = expected.length, i = -1;
  if (actual.length !== n) return false;
  while (++i < n) {
      if (Array.isArray(actual[i])) {
	  if (! inDeltaArray(actual[i], expected[i], delta)) return false;
      }
      else {
	  if (!inDeltaNumber(actual[i], expected[i], delta)) return false;
      }
  }
  return true;
}

function inDeltaNumber(actual, expected, delta) {
    var d = Math.abs(actual-expected);
    return d < delta;
}


assert.inDeltaArray = function(actual, expected, delta, message) {
    if (! inDeltaArray(actual, expected, delta))
	assert.fail(actual, expected, message || "expected {actual} to equal to {expected} within "+delta);
    return true;
}


function inDeltaAbs(actual, expected, delta) {
    var d = Math.abs(Math.abs(actual)-Math.abs(expected));
    return d < delta;
}

assert.inDeltaArrayAbs = function(actual, expected, delta, message) {
  var n = expected.length, i = -1;
  if (actual.length !== n) return false;
  while (++i < n)
      if (!inDeltaAbs(actual[i], expected[i], delta)) 
	  assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDeltaArrayAbs);
  return true;
};
