reorder.graph_random_erdos_renyi = function(n, p, directed) {
    if (p <= 0)
	return reorder.graph_empty(n, directed);
    else if (p >= 1)
	return reorder.graph_complete(n, directed);

    var nodes = graph_empty_nodes(n),
	links = [],
	v, w, i, lr, lp;

    w = -1;
    lp = Math.log(1.0 - p);

    if (directed) {
	for (v = 0; v < n; ) {
	    lr = Math.log(1.0 - Math.random());
	    w = w + 1 + Math.floor(lr/lp);
	    if (v == w)
		w = w+1;
	    while (w >= n && v < n) {
		w = w - n;
		v = v + 1;
		if (v == w)
		    w = w+1;
	    }
	    if (v < n)
		links.push({source: v, target: w});
	}
    }
    else {
	for(v = 1; v < n; ) {
	    lr = Math.log(1.0 - Math.random());
	    w = w + 1 + Math.floor(lr/lp);
	    while (w >= v && v < n) {
		w = w - v;
		v = v + 1;
	    }
	    if (v < n)
		links.push({source: v, target: w});
	}
    }
    return reorder.graph(nodes, links, directed).init();
};

reorder.graph_random = reorder.graph_random_erdos_renyi;
