
/*jshint loopfunc:true */
reorder.cuthill_mckee = function(graph, comp) {
    if (comp.length < 3)
	return comp;

    var nodes = graph.nodes(),
	start = comp[0], 
	min_deg = graph.degree(start),
	i, n, edges, e,
	visited = {},
	queue = new Queue(),
	inv = inverse_permutation(comp),
	perm = [];

    for (i = 0; i < comp.length; i++) {
	n = comp[i];
	if (graph.degree(n) < min_deg) {
	    min_deg = graph.degree(n);
	    start = n;
	    if (min_deg == 1)
		break;
	}
    }
    queue.push(start);
    while (queue.length !== 0) {
	n = queue.shift();
	if (visited[n])
	    continue;
	visited[n] = true;
	perm.push(n);
	e = graph.edges(n)
	    .map(function(edge) { return graph.other(edge, n).index; })
	    .filter(function(n) { return !visited[n] && (n in inv); })
	    .sort(function(a, b) { // ascending by degree
		return graph.degree(a) - graph.degree(b);
	    });

	e.forEach(queue.push, queue);
    }
    return perm;
};

reorder.reverse_cuthill_mckee = function(graph, comp) {
    return reorder.cuthill_mckee(graph, comp).reverse();
};


reorder.cuthill_mckee_order = function(graph, comps) {
    var i, comp, order = [];
    if (! comps) {
	comps = graph.components();
    }
    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	order = order.concat(
	    reorder.cuthill_mckee(graph, comp));
    }
    return order;
};

reorder.reverse_cuthill_mckee_order = function(graph, comps) {
    var i, comp, order = [];
    if (! comps) {
	comps = graph.components();
    }
    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	order = order.concat(
	    reorder.reverse_cuthill_mckee(graph, comp));
    }
    return order;
};

