reorder.dijkstra = function(graph) {
    var g = graph, dijkstra = {};

    function allShortestPaths(from, queued) {
	var preds = {}, edges, v, v2, e, d, D,
	    queue = reorder.heap(function(i, j) {
		return preds[i].weight - preds[j].weight;
	    }),
	    p = { edge: -1, vertex: from, weight: 0 }, p2;
	if (! queued) 
	    queued = {};
	queued[from] = p;
	queue.insert(from);

	while (! queue.isEmpty()) {
	    p = queued[queue.pop()];
	    v = p.vertex;
//	    delete queued[v];
	    edges = graph.edges(v);
	    for (var i = 0; i < edges.length; i++) {
		e = edges[i].index;
		d = p.weight + graph.distance(e);
		v2 = graph.other(e, v).index;
		D = queued[v2];
		if (! D) {
		    p2 = {edge: e, vertex: v2, weight: d};
		    queue.insert(v2);
		    queued[v2] = p2;
		}
		else if (D.weight > d) {
		    D.weight = d;
		    D.edge = e;
		    queue.update(D.vertex);
		}
	    }
	}
	return queued;
    }

    dijkstra.shortestPath = function(from, to) {
	var map = allShortestPaths(from), path, v;
	v = map[to];
	path = [ v ];
	while (v.edge != -1) {
	    v = map[graph.other(v.edge, v.vertex).index];
	    path.unshift(v);
	}
	return path;
    };

    return dijkstra;
};
