require("science");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert"),
    seedrandom = require('seedrandom');
require("./env-assert");

Math.seedrandom('reorder');

var suite = vows.describe("reorder.ca");

suite.addBatch({
    "ca": {
	"simple": function() {
	    var mat = [
		[69, 172, 133, 27],
		[41,  84, 118, 11],
		[18, 127, 157, 43]
	    ],
		res = reorder.ca(mat, 1e-9);

	    assert.inDeltaArrayAbs(res, [-0.535, -0.263, 0.803], 0.001);
	}
    }
});

suite.export(module);

