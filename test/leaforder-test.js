require("science");
require("../reorder.v1");
require("../reorder.v1");

var vows = require("vows"),
    assert = require("assert");

var suite = vows.describe("reorder.optimal_leaf_order");

function eucl(a, b) {
    var x = b - a;
    return x*x;
};

function remove_equal_dist(dm) {
    var i, j, v, row, values = {};

    for (i = 0; i < dm.length; i++) {
	row = dm[i];
	for (j = i+1; j < dm.length; j++) {
	    v = row[j];
	    if (values[v]) {
		console.log("Duplicate dist "+v+" at ["+i+","+j+"]");
		v += Math.random() / 1000;
		row[j] = v;
		dm[j][i] = v;
	    }
	    values[v] = true;
	}
    }
}

function clusterEqual(h1, h2) {
    //console.log(h1);
    //console.log(h2);
    if (h1 == h2)
	return true;
    return h1.dist == h2.dist
	&& h1.size == h2.size
	&& h1.depth == h2.depth
	&& ((clusterEqual(h1.left, h2.left)
	     && clusterEqual(h1.right, h2.right)) 
	    || (clusterEqual(h1.left, h2.right)
		&& clusterEqual(h1.right, h2.left)));
}

suite.addBatch({
    "leaforder": {
	"simple": function() {
	    var data = [2, 1, 4, 3],
		expect = [1, 2, 3, 4];
	    var x = reorder.optimal_leaf_order().distance(eucl)(data);
	    assert.deepEqual(reorder.stablepermute(data, x), expect);
	    
	    x = reorder.optimal_leaf_order()(expect);
	    assert.deepEqual(reorder.stablepermute(expect, x), expect);
	},
	"lesssimple": function() {
	    var prev =0, data = [prev], next;
	    for (var i = 0; i < 30; i++) {
		next = Math.random()+prev;
		data.push(next);
		prev = next;
	    }
	    var randata = reorder.randomPermute(data.slice());
	    var x = reorder.optimal_leaf_order().distance(eucl)(randata);
	    assert.deepEqual(reorder.stablepermute(randata.slice(), x), data);
	},
	"evenharder": function() {
	    var rows = 30, cols = 20, array = [], i, j, row;
	    
	    for (i = 0; i < rows; i++) {
		row = [];
		array.push(row);
		for (j = 0; j < cols; j++) {
		    row.push(Math.random());
		}
	    }
	    var order = reorder.optimal_leaf_order(),
		perm = order(array);
	    // Check determinism
	    for (i = 0; i < 3; i++) {
		var p2 = order(array);
		assert.deepEqual(perm, p2);
	    }
	    // Disambiguate distance matrix to have a
	    // deterministic hcluster
	    var dm = reorder.dist()(array);
	    
	    remove_equal_dist(dm);
	    //reorder.printmat(dm);
	    var h1 = science.stats.hcluster()
		    .linkage("complete")
		    .distanceMatrix(dm)(array);

	    perm = reorder.optimal_leaf_order()
		.distanceMatrix(dm)(array);
	    var a2 = reorder.permute(array, perm),
		d2 = reorder.dist()(a2);
	    dm=reorder.permute(dm, perm);
	    dm=reorder.permutetranspose(dm, perm);

	    assert.deepEqual(d2, dm);

	    var h2 = science.stats.hcluster()
		    .linkage("complete")
		    .distanceMatrix(d2)(a2);

	    assert.isTrue(clusterEqual(h1, h2), "Clusters are not equal");
	    
	    var p3 = order.distanceMatrix(d2)(a2);

	    assert.deepEqual(p3, reorder.range(0, p3.length));
	}
    }
});

suite.export(module);
