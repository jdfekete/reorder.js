require("science");
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.ca");

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
	    assert.inDeltaArray(res, [-0.5354605, -0.2626774, 0.8026722], 0.001);
	}
    }
});

suite.export(module);

