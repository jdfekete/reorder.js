require("science")
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.dijkstra");

suite.addBatch({
    "Dijkstra": {
	"simple": function() {
	    var nodes = [{id: 0}, {id: 1}, {id: 2}],
	        links = [{source: 0, target: 1}, {source:1, target: 2}];
	    var graph = reorder.graph(nodes, links)
		.init();
	    var dijkstra = reorder.dijkstra(graph);

	    assert.equal(dijkstra.shortestPath(0, 2).length, 3);
	},
	"lesssimple": function() {
	    var I = Infinity, vertexCount = 20, edges = [
		{source: 12, target: 5},
		{source: 4, target: 13},
		{source: 14, target: 9},
		{source: 10, target: 4},
		{source: 1, target: 10},
		{source: 14, target: 4},
		{source: 9, target: 3},
		{source: 11, target: 15},
		{source: 3, target: 15},
		{source: 5, target: 7},
		{source: 9, target: 10},
		{source: 13, target: 9},
		{source: 16, target: 11},
	    ];
	    var dist = [
		I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, 
		I, 3, 2, I, I, I, I, 2, 1, 5, I, 3, 3, 4, 6, I, I, I, 
		I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, 
		3, I, I, I, I, 1, 2, 2, I, 2, 2, 1, 3, I, I, I, 
		I, I, I, I, 2, 1, 5, I, 1, 1, 4, 6, I, I, I, 
		I, 1, I, I, I, I, 1, I, I, I, I, I, I, I, 
		I, I, I, I, I, I, I, I, I, I, I, I, I, 
		I, I, I, I, 2, I, I, I, I, I, I, I, 
		I, I, I, I, I, I, I, I, I, I, I, 
		1, 3, I, 1, 1, 2, 4, I, I, I, 
		4, I, 2, 2, 3, 5, I, I, I, 
		I, 4, 4, 1, 1, I, I, I, 
		I, I, I, I, I, I, I, 
		2, 3, 5, I, I, I, 
		3, 5, I, I, I, 
		2, I, I, I, 
		I, I, I, 
		I, I, 
		I, 
	    ];
	}
    }
});

suite.export(module);

