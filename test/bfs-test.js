var reorder = require("../dist/reorder.cjs");


var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.bfs");

suite.addBatch({
    "all_pairs_distance": {
	"simple": function() {
	    var nodes = [{id: 0}, {id: 1}, {id: 2}],
	        links = [{source: 0, target: 1}, {source:1, target: 2}];
	    var graph = reorder.graph(nodes, links)
		.init();
	    var dist = reorder.bfs_distances(graph, 0);
	    //console.log('Dist: %j', dist);

	    assert.equal(Object.keys(dist).length, 3); 
	    assert.equal(dist[0], 0);
	    assert.equal(dist[1], 1);
	    assert.equal(dist[2], 2);
	}
    }
});

suite.export(module);

