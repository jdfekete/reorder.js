require("science");
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert"),
    seedrandom = require('seedrandom');
Math.seedrandom('reorder');

var suite = vows.describe("reorder.ca");

function inDeltaArray(actual, expected, delta) {
  var n = expected.length, i = -1;
  if (actual.length !== n) return false;
  while (++i < n) if (!inDeltaNumber(actual[i], expected[i], delta)) return false;
  return true;
}

function inDeltaNumber(actual, expected, delta) {
    var d = Math.abs(actual-expected);
    //console.log("d="+d+": "+((d < delta) ? "pass" : "fail"));
    return d < delta;
}

suite.addBatch({
    "ca": {
	"simple": function() {
	    var mat = [
		[69, 172, 133, 27],
		[41,  84, 118, 11],
		[18, 127, 157, 43]
	    ],
		res = reorder.ca(mat, 0.0001);

	    //assert.isTrue(true);
	    if (!inDeltaArray(res, [-0.5354605, -0.2626774, 0.8026722], 0.001)
		&&  !inDeltaArray(res, [0.5354605, 0.2626774, -0.8026722], 0.001)) {
		assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDelta);
	    }
	}
    }
});

suite.export(module);

