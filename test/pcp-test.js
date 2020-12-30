var reorder = require("../dist/reorder.cjs");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.pcp");

suite.addBatch({
    "pcp": {
	"simple": function() {
	    var earray = [[0, 1, 2], [3, 4, 5]],
		dicts = reorder.array_to_dicts(earray);
	    assert.equal(dicts.length, earray.length);
	    var array = reorder.dicts_to_array(dicts);
	    assert.deepEqual(earray,array);
	}
    }
});

suite.export(module);


