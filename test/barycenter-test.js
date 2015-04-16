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
		graph = reorder.mat2graph(mat, true),
		expect = [0, 1, 3, 2, 4];
	    reorder.printmat(mat);
	    perm = reorder.barycenter(graph);
	    reorder.printmat(mat, perm[1], perm[0]);
	    assert.deepEqual(perm, expect);
	}
    }
});

suite.export(module);
