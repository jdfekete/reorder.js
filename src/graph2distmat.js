// Converts a graph with weighted edges (weight in l.value)
// into a distance matrix suitable for reordering with e.g.
// Optimal Leaf Ordering.

export function distmat2valuemat(distmat) {
    var n = distmat.length,
	valuemat = reorder.zeroes(n, n),
	max_dist = reorder.distmax(distmat),
	i, j;

    for (i = 0; i < n; i++) {
	for (j = i; j < n; j++) {	    
	    valuemat[j][i] = valuemat[i][j] = 1+max_dist - distmat[i][j];
	}
    }
    return valuemat;
}

export function graph2valuemats(graph, comps) {
    if (! comps)
	comps = graph.components();

    var	dists = reorder.all_pairs_distance(graph, comps);
    return dists.map(distmat2valuemat);
};

export function valuemats_reorder(valuemats, leaforder, comps) {
    var orders = valuemats.map(leaforder);

    if (comps) {
	orders = orders.map(function(d, i) {
	    return reorder.permute(comps[i], d);
	});
    }
    return orders.reduce(reorder.flatten);
};
