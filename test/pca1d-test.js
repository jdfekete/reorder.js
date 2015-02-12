require("science");
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.pca1d");

assert.inDeltaArray = function(actual, expected, delta, message) {
  if (!inDeltaArray(actual, expected, delta)) {
    assert.fail(actual, expected, message || "expected {actual} to be in within *" + delta + "* of {expected}", null, assert.inDelta);
  }
};

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
    "pca1d": {
	"simple": function() {
	    var mat = [
		[2.5, 2.4],
		[0.5, 0.7],
		[2.2, 2.9],
		[1.9, 2.2],
		[3.1, 3.0],
		[2.3, 2.7],
		[2.0, 1.6],
		[1.0, 1.1],
		[1.5, 1.6],
		[1.1, 0.9]
	    ],
		pca = reorder.pca1d(mat);
	    
	    assert.inDeltaArray(pca,
			   [0.67833, 0.734755],
			   0.001);

	    assert.deepEqual(reorder.sortorder(pca), [0, 1]);
	},
	"lesssimple": function() {
	    var data = [
		[80, 27, 89, 42],
		[80, 27, 88, 37],
		[75, 25, 90, 37],
		[62, 24, 87, 28],
		[62, 22, 87, 18],
		[62, 23, 87, 18],
		[62, 24, 93, 19],
		[62, 24, 93, 20],
		[58, 23, 87, 15],
		[58, 18, 80, 14],
		[58, 18, 89, 14],
		[58, 17, 88, 13],
		[58, 18, 82, 11],
		[58, 19, 93, 12],
		[50, 18, 89, 8],
		[50, 18, 86, 7],
		[50, 19, 72, 8],
		[50, 19, 79, 8],
		[50, 20, 80, 9],
		[56, 20, 82, 15],
		[70, 20, 91, 15]
	    ],
		pca = reorder.pca1d(data, 0.0001);
	    
	    assert.inDeltaArray(pca, [0.642, 0.195, 0.197, 0.715], 0.001);
	    assert.deepEqual(reorder.sortorder(pca), [1, 2, 0, 3]);
	}
    }
});

suite.export(module);

