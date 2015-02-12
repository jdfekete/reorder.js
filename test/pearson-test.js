require("science")
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.pearson");

suite.addBatch({
    "pearson": {
	"simple": function() {
	    var a = [1, 2, 3, 4, 5], b = [5, 4, 3, 2, 1];

	    assert.equal(reorder.correlation.pearson(a, b), -1);
	}
    }
});

suite.export(module);

