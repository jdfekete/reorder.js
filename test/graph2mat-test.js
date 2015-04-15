require("science")
require("../reorder.v1");
require("../reorder.v1");
var seedrandom = require('seedrandom');

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.graph2mat");

Math.seedrandom('reorder');

suite.addBatch({
    "graph2mat": {
	"simple": function() {
	    var mat = [
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0]
	    ];
	    var graph = reorder.mat2graph(mat);
	    assert.equal(graph.nodes().length, 3);
	    assert.equal(graph.links().length, 4);
	    var m2 = reorder.graph2mat(graph);
	    assert.deepEqual(m2, mat);
	},
	"lesssimple": function() {
	    var mat = reorder.randomMatrix(10, 0.2),
		graph = reorder.mat2graph(mat),
		m2 = reorder.graph2mat(graph);
	    //console.log(mat);
	    assert.deepEqual(m2, mat);
	},
	"hard": function() {
	    for (var i = 10; i < 100; i += 20) {
		var mat = reorder.randomMatrix(i, Math.sqrt(5/(i*i))),
		    graph = reorder.mat2graph(mat),
		    m2 = reorder.graph2mat(graph);
		assert.deepEqual(m2, mat);
	    }
	}
    }
});

suite.export(module);
