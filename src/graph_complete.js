reorder.complete_graph = function(n, directed) {
    var nodes = graph_empty_nodes(n),
	links = [],
	i, j;

    if (directed) {
	for (i = 0; i < n; i++) {
	    for (j = 0; j < n; j++) {
		if (i != j)
		    links.push({source: i, target: j });
	    }
	}
    }
    else {
	for (i = 0; i < (n-1); i++) {
	    for (j = i+1; j < n; j++) 
		links.push({source: i, target: j });
	}
    }
    return reorder.graph(nodes, links, directed).init();
};
