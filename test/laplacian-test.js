require("science");
require("../reorder.v1");


var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.laplacian");

suite.addBatch({
    "laplacian": {
	"simple": function() {
	    // Eiffel Tower Graph from the ACE article
	    var graph = reorder.graph()
		    .generate_nodes(5)
		    .links(
			[{source: 0, target: 1, value: 5},
			 {source: 0, target: 3, value: 4},
			 {source: 1, target: 2, value: 2},
			 {source: 1, target: 3, value: 7},
			 {source: 1, target: 4, value: 3},
			 {source: 2, target: 3, value: 2},
			 {source: 3, target: 4, value: 6}
			])
		    .init();
	    assert.deepEqual(reorder.laplacian(graph, [0, 1, 2, 3, 4]),
			     [[ 9, -5,  0, -4,  0],
			      [-5, 17, -2, -7, -3],
			      [ 0, -2,  4, -2,  0],
			      [-4, -7, -2, 19, -6],
			      [ 0, -3,  0, -6,  9]
			     ]);
	}
    }
});


suite.export(module);

