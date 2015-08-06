require("science");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert"),
    seedrandom = require('seedrandom');
require("./env-assert");

Math.seedrandom('reorder');

var suite = vows.describe("reorder.ca");

suite.addBatch({
    "ca": {
	"simple": function() {
	    var mat = [
		[69, 172, 133, 27],
		[41,  84, 118, 11],
		[18, 127, 157, 43]
	    ],
		res = reorder.ca(mat, 1e-9),
		row_order = res[0],
		col_order = res[1];

	    assert.inDeltaArray(row_order,
				[0.0047002543742699614,0.0001277333280173152,-0.005557235563474386],
				0.001);
	    assert.inDeltaArray(col_order,
				[0.008648877634363464,0.003012341005018805,-0.004699577426261494,-0.0042389549655066465],
				0.001);
	}
    }
});

suite.export(module);

