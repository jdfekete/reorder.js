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
	},
	"harder": function() {
	    var mat = [
		[1, 0, 0, 1, 0],
		[0, 1, 1, 0, 1],
		[1, 0, 0, 1, 0],
		[1, 1, 0, 0, 0],
		[0, 1, 1, 0, 1]
	    ],
		res = reorder.ca(mat),
		col_order = reorder.sort_order(res[0]),
		row_order = reorder.sort_order(res[1]);
	    console.log('col_order: '+col_order);
	    console.log('row_order: '+row_order);
	    reorder.printmat(mat);
	    mat=reorder.permute(mat, col_order);
	    mat=reorder.permutetranspose(mat, row_order);
	    reorder.printmat(mat);
	}
    }
});

suite.export(module);

