require("science");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert"),
    seedrandom = require('seedrandom'),
    numeric = require('numeric');
require("./env-assert");

Math.seedrandom('reorder');

var suite = vows.describe("reorder.ca");

function compare_order(row_order1, row_order2, msg) {
    var tmp = Array(row_order1.length), i;
    assert.equal(row_order1.length, row_order2.length);
    for (i = 0; i < row_order1.length; i++) {
	if (Math.abs(row_order2) < 1e-9)
	    tmp[i] = NaN;
	else
	    tmp[i] = row_order1[i] / row_order2[i];
    }
    reorder.printvec(tmp, 2, null, msg);
}

suite.addBatch({
    "ca": {
	"simple": function() {
	    var mat = reorder.transpose([
		[1, 0, 0, 1, 1, 0, 0, 1],
		[0, 1, 1, 0, 0, 1, 0, 1],
		[1, 1, 0, 0, 0, 1, 1, 0],
		[1, 1, 1, 1, 1, 0, 0, 1],
		[1, 1, 0, 1, 0, 0, 0, 1],
		[1, 0, 0, 0, 1, 0, 0, 0]
	    ]),
		res1 = reorder.ca_reciprocal_averaging(mat, null, [100, 0, 100, 0, 100, 0]),
		row_order1 = res1[0],
		col_order1 = res1[1],
		res2 = reorder.ca_no_svd(mat),
		row_order2 = res2[0],
		col_order2 = res2[1],
		ecol = [-1.044914, 0.970130, 1.675125, -0.439146, -0.321923, -1.239397],
		erow = [-0.396887, 0.682180, 0.384491, -0.871822, -1.314724, 1.915459, 2.425954, -0.302626],
		i, tmp;

	    compare_order(row_order1, row_order2, 'ratio between rows RA and no_svd:');
	    compare_order(col_order1, col_order2, 'ratio between cols RA and no_svd:');
	    compare_order(row_order1, erow, 'ratio between rows RA and svd:');	    
	    compare_order(col_order1, ecol, 'ratio between rows RA and svd:');	    
	    compare_order(row_order2, erow, 'ratio between rows no_svd and svd:');	    
	    compare_order(col_order2, ecol, 'ratio between rows no_svd and svd:');	    
	    /*
	    assert.inDeltaArray(row_order,
				[24, 52, 42, 11, 0, 84, 100, 25],
				0.001);
	    assert.inDeltaArray(col_order,
				[23.5, 55.9, 68.6, 33.2, 35.1, 20.9],
				0.001);
	     */
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
	    reorder.displaymat(mat);
	    reorder.displaymat(mat, col_order, row_order);
	},
	// "bertin": function() {
	//     var mat = [
	// 	[6, 6, 2, 5, 3],
	// 	[32, 6, 5, 45, 15],
	// 	[37, 61, 69, 29, 59],
	// 	[16, 23, 21, 9, 14],
	// 	[9, 4, 3, 12, 9]
	//     ],
	// 	res = reorder.ca(mat),
	// 	col_order = reorder.sort_order(res[0]),
	// 	row_order = reorder.sort_order(res[1]);
	//     console.log('col_order: '+col_order);
	//     console.log('row_order: '+row_order);
	//     reorder.printmat(mat);
	//     reorder.printmat(mat, col_order, row_order);
	// },
	"harder": function() {
	    var mat = [
		[45,126,24,5],
		[87,93,19,1],
		[0,0,52,148],
		[36,68,74,22],
		[0,30,111,59]
	    ],
		res = reorder.ca(mat),
		col_order = reorder.sort_order(res[0]),
		row_order = reorder.sort_order(res[1]);
	    console.log('col_order: '+col_order);
	    console.log('row_order: '+row_order);
	    reorder.printmat(mat);
	    reorder.printmat(mat, row_order, col_order);
	}
    }
});

suite.export(module);

