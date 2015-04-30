reorder.laplacian = function(graph, comp) {
    var n = comp.length,
	lap = reorder.zeroes(n, n),
	inv = inverse_permutation(comp),
	i, j, k, row, sum, edges, v, e, other;

    reorder.assert(! graph.directed(), "Laplacian only for undirected graphs");
    for (i = 0; i < n; i++) {
	v = comp[i];
	row = lap[i];
	sum = 0;
	edges = graph.edges(v);
	for (j = 0; j < edges.length; j++) {
	    e = edges[j];
	    other = inv[graph.other(e, v).index];
	    if (other != i) {
		sum += e.value;
		row[other] = -e.value;
	    }
	}
	row[i] = sum;
    }

    return lap;
};
