reorder.barycenter = function(graph, comps) {
    var perm = [];
    // Compute the barycenter heuristic on each connected component
    if (! comps) {
	comps = graph.components();
    }
    for (var i = 0; i < comps.length; i++)
	perm = perm.concat(reorder.barycenter1(graph, comps[i]));n
    return perm;
};

function inverse_perm(perm) {
    var inv = {};
    for (var i = 0; i < perm.length; i++) {
	inv[perm[i]] = i;
    }
    return inv;
}

// Take the list of neighbor indexes and return the median according to 
// P. Eades and N. Wormald, Edge crossings in drawings of bipartite graphs.
// Algorithmica, vol. 11 (1994) 379–403.
function median(neighbors) {
    if (neighbors.length == 1)
	return neighbors[0];
    if (neighbors.length == 2)
	return (neighbors[0]+neighbors[1])/2;
    neighbors.sort();
    if (neighbors.length % 2)
	return neighbors[neighbors.length/2];
    var rm = neighbors.length/2,
	lm = rm - 1,
	rspan = neighbors[neighbors.length-1] - neighbors[rm],
	lspan = neighbors[lm] - neighbors[0];
    if (lspan == rspan)
	return (neighbors[lm] + neighbors[rm])/2;
    else
	return (neighbors[lm]*rspan + neighbors[rm]*lspan) / (lspan+rspan);
}

reorder.barycenter1 = function(graph, comp, iter) {
    var nodes = graph.nodes(),
	perm1, inv1,
	perm2, inv2,
	i, tmp;

    if (comp.length < 3)
	return comp;

    if (! iter)
	iter = 20;

    perm1 = comp;
    inv1 = inverse_perm(perm1);
    perm2 = perm1.slice(); // copy
    inv2 = inv1; // no need to copy
    
    while (iter--) {
	for (i = 0; i < perm1.length; i++) {
	    // Compute the median/barycenter for this node and set
	    // its (real) value into node.mval
	    var v = nodes[perm1[i]],
		neighbors = graph.neighbors(v.index).map(function(n) {
		    return inv1[n.index];
		});
	    v.median = median(neighbors);
	}
	perm1.sort(function(a, b) {
	    var d = nodes[a].median - nodes[b].median;
	    if (d == 0) {
		// If both values are equal,
		// place the odd degree vertex on the left of the even
		// degree vertex
		d = (graph.edges(b).length%2) - (graph.edges(a).length%2);
	    }
	    if (d < 0) return -1;
	    else if (d > 0) return 1;
	    return 0;
	});
	inv1 = inverse_perm(perm1);
	tmp = perm1; perm1 = perm2; perm2 = tmp;
	tmp = inv1; inv1 = inv2; inv2 = tmp;
    }
    return perm2;
};
