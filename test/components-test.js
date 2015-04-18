require("science");
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.components");

suite.addBatch({
    "components": {
	"simple": function() {
	    var nodes = [{id: 0}, {id: 1}, {id: 2}],
	        links = [{source: 0, target: 1}, {source:1, target: 2}];
	    var graph = reorder.graph()
		.nodes(nodes)
		.links(links)
		.init();
	    
	    var components = graph.components();
	    assert.equal(components.length, 1);
	    assert.equal(components[0].length, 3);
	},
	"lesssimple": function() {
	    var nodes = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}],
	        links = [
		    {source: 0, target: 1}, {source:1, target: 2},
		    {source: 3, target: 4}
		];
	    var graph = reorder.graph()
		.nodes(nodes)
		.links(links)
		.init();
	    
	    var components = graph.components();
	    assert.equal(components.length, 2);
	    assert.equal(components[0].length, 3);
	    assert.equal(components[1].length, 2);
	}
    }
});

suite.export(module);
