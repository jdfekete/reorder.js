require("science");
var reorder = require("../dist/reorder.cjs");

var vows = require("vows"),
    assert = require("assert");
var seedrandom = require('seedrandom');
Math.seedrandom('reorder');

var suite = vows.describe("reorder.graph2distmat");

suite.addBatch({
    "graph2distmat": {
	"simple": function() {
	    var mat = [
		[0, 1, 0],
		[1, 0, 1],
		[0, 1, 0]
	    ],
		dist = [
		    [0, 1, 2],
		    [1, 0, 1],
		    [2, 1, 0]
		];
	    var graph = reorder.mat2graph(mat);
	    assert.equal(graph.nodes().length, 3);
	    assert.equal(graph.links().length, 2);
	    var dists = reorder.all_pairs_distance(graph);
	    assert.deepEqual(dists[0], dist);
	    var valuemat = reorder.distmat2valuemat(dist);
	    assert.deepEqual(valuemat,
			     [[3, 2, 1],
			      [2, 3, 2],
			      [1, 2, 3]]);
	    // var max_link = graph.links().reduce(
	    // 	function(a, b) {
	    // 	    return a.value > b.value ? a : b;
	    // 	}),
	    // 	max_value = max_link ? max_link.value : 0;
	    // var links = graph.links()
	    // 	    .map(function(l) {
	    // 		return {
	    // 		    value: (max_value - l.value)/max_value,
	    // 		    source: l.source.index,
	    // 		    target: l.target.index
	    // 		};
	    // 	    });
	    // console.log(links);
	}
    }
});

suite.export(module);
