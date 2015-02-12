require("../reorder.v1");
require("../reorder.v1");
require("science")

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.leafOrder");

suite.addBatch({
    "leaforder": {
	"simple": function() {
	    var data = [[3], [4], [1], [2]];
	    var x = reorder.leafOrder()(data);
	    assert.deepEqual(x, [[1], [2], [3], [4]])
	}
    }
});


suite.export(module);
