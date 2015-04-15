require("science")
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.mat2graph");

suite.addBatch({
    "mat2graph": {
	"simple": function() {
	    var mat = [
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0]
	    ];
	    var graph = reorder.mat2graph(mat);
	    assert.equal(graph.nodes().length, 3);
	    assert.equal(graph.links().length, 4);
	},
	"lesssimple": function() {
	    var mat = [
		[0, 1, 0, 1, 0],
		[1, 0, 1, 0, 1],
		[0, 1, 0, 1, 1],
		[1, 1, 1, 0, 0]
	    ];
	    var graph = reorder.mat2graph(mat, true); // directed graph
	    assert.equal(graph.nodes().length, 5);
	    assert.equal(graph.links().length, 11);
	    var m2 = reorder.graph2mat(graph);
	    assert.deepEqual(m2, mat);
	}
    }
});

suite.export(module);
