require("science");
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.barycenter");

function dotest(mat) {
    var graph = reorder.mat2graph(mat, true);
    //reorder.printmat(mat);
    var initial_crossings = reorder.count_crossings(graph);
    var perms = reorder.barycenter(graph);
    //console.log('VOrder: %j, HOrder: %j, Crossings: %d',
    //perms[1], perms[0], perms[2]);
    //reorder.printmat(mat, perms[1], perms[0]);
    assert.isTrue(initial_crossings > perms[2]);
}

suite.addBatch({
    "barycenter": {
	"simple": function() {
	    var mat = [
		[0, 1, 0, 1, 0],
		[1, 0, 1, 0, 1],
		[0, 1, 0, 1, 1],
		[1, 1, 1, 0, 0]];
	    dotest(mat);
	},
	"hard": function() {
	    for (var i = 10; i < 100; i += 20) {
		for (var j = 10; j < 100; j += 20) {
		    var mat = reorder.randomMatrix(0.2, i, j, false);
		    dotest(mat);
		}
	    }
	}
    }
});

suite.export(module);
