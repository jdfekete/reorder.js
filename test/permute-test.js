require("science");
Queue = require('tiny-queue');
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.permute");

suite.addBatch({
    "permute": {
	"simple1": function() {
	    assert.deepEqual(reorder.permute([0], [0]), [0]);
	},
	"simple2": function() {
	    assert.deepEqual(reorder.permute([0, 1], [0, 1]), [0, 1]);
	},
	"simple3": function() {
	    assert.deepEqual(reorder.permute([1, 0], [0, 1]), [1, 0]);
	},
	"simple4": function() {
	    assert.deepEqual(reorder.permute([0, 1], [1, 0]), [1, 0]);
	},
	"simple5": function() {
	    assert.deepEqual(reorder.permute([0, 1, 2], [1, 2, 0]), [1, 2, 0]);
	},
	"harder": function() {
	    for (var i = 10; i <= 100; i += 10) {
		var list = reorder.permutation(i),
		    perm = reorder.randomPermute(list.slice());

		assert.deepEqual(perm, reorder.permute(list, perm));
	    }
	},
	"hard": function() {
	    for (var i = 10; i <= 100; i++) {
		var list = reorder.permutation(i),
		    perm = reorder.randomPermute(list.slice()),
		    permc = perm.slice(),
		    inv = reorder.inverse_permutation(perm, true);

		assert.deepEqual(list, reorder.permute(inv.slice(), perm));
		assert.deepEqual(perm, permc);
		assert.deepEqual(list, reorder.permute(perm.slice(), inv));
	    }
	}

    }
});

suite.export(module);

