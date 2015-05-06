reorder.edgesum = function(graph, order) {
    if (! order)
	order = reorder.range(graph.nodes().length);

    var inv = inverse_permutation(order),
	links = graph.links(),
	i, e, d, sum = 0;

    for (i = 0; i < links.length; i++) {
	e = links[i];
	d = Math.abs(inv[e.source.index]-inv[e.target.index]);
	sum += d;
    }
    return sum;
};
