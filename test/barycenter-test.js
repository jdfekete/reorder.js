require("science");
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.barycenter");

suite.addBatch({
    "barycenter": {
	"simple": function() {
	    var mat = [
		[0, 1, 0, 1, 0],
		[1, 0, 1, 0, 1],
		[0, 1, 0, 1, 1],
		[1, 1, 1, 0, 0]],
		expect = [1, 2, 3, 4];
	}
    }
});

suite.export(module);
