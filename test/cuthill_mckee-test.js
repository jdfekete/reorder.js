require("science");
Queue = require('tiny-queue');
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.cuthill_mckee");

suite.addBatch({
    "components": {
	"simple": function() {
	    var mat = [[1, 0, 0, 0, 1, 0, 0, 0],
		       [0, 1, 1, 0, 0, 1, 0, 1],
		       [0, 1, 1, 0, 1, 0, 0, 0],
		       [0, 0, 0, 1, 0, 0, 1, 0],
		       [1, 0, 1, 0, 1, 0, 0, 0],
		       [0, 1, 0, 0, 0, 1, 0, 1],
		       [0, 0, 0, 1, 0, 0, 1, 0],
		       [0, 1, 0, 0, 0, 1, 0, 1]];
	    //reorder.displaymat(mat);
	    var graph = reorder.mat2graph(mat);
	    var components = graph.components();
	    assert.equal(components.length, 2);
	    assert.equal(reorder.bandwidth(graph), 6);
	    var order = reorder.reverse_cuthill_mckee(graph);
	    //reorder.displaymat(mat, order, order);
	    assert.deepEqual(order, [6, 3, 7, 5, 1, 2, 4, 0]);
	    assert.equal(reorder.bandwidth(graph, order), 2);
	},
	"harder": function() {
	    for (var i = 10; i < 100; i += 20) {
		var mat = reorder.random_matrix(0.2, i),
		    graph = reorder.mat2graph(mat),
		    bw = reorder.bandwidth(graph),
		    order = reorder.reverse_cuthill_mckee(graph);
		assert.lesser(reorder.bandwidth(graph, order), bw);
	    }
	}
    }
});

suite.export(module);
