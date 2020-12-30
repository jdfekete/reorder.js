var reorder = require("../dist/reorder.cjs");

var vows = require("vows"),
    assert = require("assert"),
    seedrandom = require('seedrandom');
//var    jf = require('jsonfile');

Math.seedrandom('reorder');

var suite = vows.describe("reorder.count_crossings");

function naive_count_crossings(graph, north, south) {
    var i, j, e1, e2, v, count = 0,
	inv_north = reorder.inverse_permutation(north),
	inv_south = reorder.inverse_permutation(south),
	links = [];
    for (i = 0; i < north.length; i++) {
	v = north[i];
	links = links.concat(graph.outEdges(v).map(function(e) {
	    return [ inv_north[e.target.index], inv_south[e.source.index] ];
	}));
    }
    for (i = 0; i < links.length; i++) {
	e1 = links[i];
	for (j = i+1; j < links.length; j++) {
	    e2 = links[j];
	    if ((e1[0] < e2[0] && e1[1] > e2[1]) 
		|| (e1[0] > e2[0] && e1[1] < e2[1])) 
		count++;
	}
    }
    return count;
}

function dotest(mat) {
    var graph = reorder.mat2graph(mat, true),
	comps = graph.components(),
	comp = comps.reduce(function(a, b) {
	    return  (a.length > b.length) ? a : b;
	});
    comp.sort(function(a,b){return a-b; });
    var layer1 = comp.filter(function(n) {
	return graph.outEdges(n).length!=0;
    }),
	layer2 = comp.filter(function(n) {
	    return graph.inEdges(n).length!=0;
	});
    //console.time('fast_crossings');
    var c1 = reorder.count_crossings(graph, layer1, layer2);
    //console.timeEnd('fast_crossings');
    //console.time('naive_crossings');
    var c2 = naive_count_crossings(graph, layer1, layer2);
    //console.timeEnd('naive_crossings');
    // if (c1 != c2) {
    // 	var file = 'error_count_crossings.json';
    // 	jf.writeFile(file, mat, function(err) {
    // 	    console.log(err);
    // 	});
    // }
    assert.equal(c1, c2);
}

suite.addBatch({
    "count_crossings": {
	"simple": function() {
	    var graph = reorder.graph()
		    .nodes([{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}])
		    .links([{source: 0, target: 0},
			    {source: 1, target: 1},
			    {source: 1, target: 2},
			    {source: 2, target: 0},
			    {source: 2, target: 3},
			    {source: 2, target: 4},
			    {source: 3, target: 0},
			    {source: 3, target: 2},
			    {source: 4, target: 3},
			    {source: 5, target: 2},
			    {source: 5, target: 4}])
		    .directed(true)
		    .init(),
		comp = graph.components()[0],
		layer1 = comp.filter(function(n) {
		    return graph.outEdges(n).length!=0;
		}),
		layer2 = comp.filter(function(n) {
		    return graph.inEdges(n).length!=0;
		});
	    
	    
	    assert.equal(naive_count_crossings(graph, layer1, layer2),
			 12);
	    assert.equal(reorder.count_crossings(graph, layer1, layer2),
			 12);
	},
	"bug": function() {
	    dotest([
    [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
	    ]);
	},
	"hard": function() {
	    for (var i = 10; i < 100; i += 20) {
		for (var j = 10; j < 100; j += 20) {
		    var mat = reorder.random_matrix(0.2, i, j, false);
		    dotest(mat);
		}
	    }
	}
    }
});

suite.export(module);
