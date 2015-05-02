
/*jshint loopfunc:true */
bfs_order = function(graph, comps) {
    if (! comps)
	comps = graph.components();

    var i, comp, order = [];

    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	reorder.bfs(graph, comp[0], function(v, c) {
	    if (c >= 0 && v != c)
		order.push(v);
	});
    }
    return order;
};
