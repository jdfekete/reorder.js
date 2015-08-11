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
  if (actual.length !== n) {
      assert.fail(actual, expected, message || "expected {actual} to have the same length *" + n + "* as {expected}", null, assert.inDeltaArrayAbs);
  }
  while (++i < n)
      if (!inDeltaAbs(actual[i], expected[i], delta)) 
	  assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDeltaArrayAbs);
  return true;
};

function neg(a) {
    return a.map(function(x) { return -x; });
}

assert.inDeltaArrayOrNeg = function(actual, expected, delta, message) {
    if (! inDeltaArray(actual, expected, delta) &&
       ! inDeltaArray(neg(actual), expected, delta))
	assert.fail(actual, expected, message || "expected {actual} to equal to {expected} within "+delta);
    return true;
};

function permutationEqual(actual, expected) {
    var n;
    if (! (Array.isArray(actual) && Array.isArray(expected)))
	return false;
    n = actual.length;
    if (n != expected.length)
	return false;
    while(n--) 
	if (actual[n] != expected[n])
	    return false;
    return true;
}

function permutationInverted(actual, expected) {
    var n, i;
    if (! (isArray(actual) && isArray(expected)))
	return false;
    n = actual.length;
    if (n != expected.length)
	return false;
    i = n-1;
    while(n--) 
	if (actual[n] != expected[i-n])
	    return false;
    return true;
}

assert.permutationEqual = function(actual, expected, message) {
    if (! permutationEqual(actual, expected) &&
	! permutationInverted(actual, expected))
	assert.fail(actual, expected, message || "expected {actual} to be equal or inverse of {expected}");
    return true;
}
