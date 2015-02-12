require("science")
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.heap");

suite.addBatch({
    "Heap": {
	"simple": function() {
	    var heap = reorder.heap(function(a, b) { return a-b; });
	    heap.insert(3);
	    heap.insert(2);
	    heap.insert(4);
	    heap.insert(1);
	    heap.insert(0);

	    assert.equal(heap.peek(), 0);
	    assert.equal(heap.pop(), 0);
	    assert.equal(heap.peek(), 1);
	    assert.equal(heap.pop(), 1);
	    assert.equal(heap.peek(), 2);
	    assert.equal(heap.pop(), 2);
	    assert.equal(heap.peek(), 3);
	    assert.equal(heap.pop(), 3);
	    assert.equal(heap.pop(), 4);
	    try {
		heap.pop();
		assert.isTrue(false);
	    }
	    catch(e) {
		assert.equal(e.error, "Empty heap");
	    }
	},
	"lesssimple": function() {
	    var r, i;
	    for (r = 0; r < 10; ++r) { // repeat 10
		var heap = reorder.heap(function(a, b) { return a-b; });
		var p = reorder.randomPermutation(10);
		assert.equal(p.length, 10);
//		console.log("p = %j", p);
		for (i = 0; i < p.length; ++i)
		    heap.insert(p[i]);
		
		for (i = 0; i < p.length; ++i) {
		    var v = heap.pop();
//		    console.log("v[%d] = %d", i, v);
		    assert.equal(v, i);
		}
		try {
		    heap.pop();
		    assert.isTrue(false);
		}
		catch(e) {
		    assert.equal(e.error, "Empty heap");
		}
	    }
	}
    }
});

suite.export(module);

