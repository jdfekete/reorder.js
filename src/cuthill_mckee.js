reorder.cuthill_mckee = function(graph, comps) {
    var i, order = [];
    if (! comps) {
	comps = graph.components();
    }
    for (i = 0; i < comps.length; i++) {
	order = order.concat(reorder.cuthill_mckee1(graph, comps[i]));
    }
    return order;
};


reorder.cuthill_mckee1 = function(graph, comp) {
    if (comp.length < 2)
	return comp;

    var nodes = graph.nodes(),
	start = comp[0], 
	min_deg = graph.degree(start),
	i, n, edges, e,
	visited = {},
	queue = new Queue(),
	order = [];
    
    for (i = 0; i < comp.length; i++) {
	n = nodes[comp[i]].index;
	if (graph.degree(n) < min_deg) {
	    min_deg = graph.degree(n);
	    start = n;
	    if (min_deg == 1)
		break;
	}
    }
    queue.push(start); //TODO replace with a proper queue
    while (queue.length != 0) {
	n = queue.shift();
	if (visited[n])
	    continue;
	visited[n] = true;
	order.push(n);
	e = graph.edges(n)
	    .map(function(edge) { return graph.other(edge, n).index; })
	    .filter(function(n) { return !visited[n]; })
	    .sort(function(a, b) { // ascending by degree
		return graph.degree(a) - graph.degree(b);
	    });

	e.forEach(queue.push, queue);
    }
    return order;
};

reorder.reverse_cuthill_mckee = function(graph, comps) {
    return reorder.cuthill_mckee(graph, comps).reverse();
};
