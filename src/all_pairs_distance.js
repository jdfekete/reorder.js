reorder.all_pairs_distance = function(graph, comps) {
    var distances = [];
    if (! comps)
	comps = graph.components();

    for (var i = 0; i < comps.length; i++) 
	distances.push(reorder.all_pairs_distance1(graph, comps[i]));
    return distances;
};

function all_pairs_distance_floyd_warshall(graph, comp) {
    var dist = reorder.infinities(comp.length, comp.length),
	i, j, k, inv;
    // Floyd Warshall, 
    // see http://ai-depot.com/BotNavigation/Path-AllPairs.html
    // O(n^3) unfortunately

    inv = inverse_permutation(comp);

    for (i = 0; i < comp.length; i++)
	dist[i][i] = 0;
    
    var build_dist = function(e) {
	if (e.source == e.target) return;
	if (! (e.source.index in inv) || ! (e.target.index in inv))
	    return; // ignore edges outside of comp
	var u = inv[e.source.index],
	    v = inv[e.target.index];
	dist[v][u] = dist[u][v] = graph.distance(e.index);
    };
    for (i = 0; i < comp.length; i++) {
	graph.edges(comp[i]).forEach(build_dist);
    }

    for (k=0; k<comp.length; k++) {
	for (i=0; i<comp.length; i++)
	    if (dist[i][k] != Infinity) {
		for (j=0; j<comp.length; j++)
		    if (dist[k][j] != Infinity
			&& dist[i][j] > dist[i][k] + dist[k][j]) {
			dist[i][j] = dist[i][k] + dist[k][j];
			dist[j][i] = dist[i][j];
		    }
	    }
    }
    return dist;
}

reorder.all_pairs_distance1 = all_pairs_distance_floyd_warshall;

function floyd_warshall_with_path(graph, comp) {
    if (! comp)
	comp = graph.components()[0];

    var dist = reorder.infinities(comp.length, comp.length),
	next = Array(comp.length),
	directed = graph.directed(),
	i, j, k, inv;
    // Floyd Warshall, 
    // see http://ai-depot.com/BotNavigation/Path-AllPairs.html
    // O(n^3) unfortunately

    inv = inverse_permutation(comp);
    
    for (i = 0; i < comp.length; i++) {
	dist[i][i] = 0;
	next[i] = Array(comp.length);
    }
    
    var build_dist = function(e) {
	if (e.source == e.target) return;
	var u = inv[e.source.index],
	    v = inv[e.target.index];
	dist[u][v] = graph.distance(e);
	next[u][v] = v;
	if (! directed) {
	    dist[v][u] = graph.distance(e);
	    next[v][u] = u;
	}
    };
    
    for (i = 0; i < comp.length; i++) {
	graph.edges(comp[i]).forEach(build_dist);
    }

    for (k=0; k<comp.length; k++) {
	for (i=0; i<comp.length; i++) {
	    for (j=0; j<comp.length; j++) {
		if (dist[i][j] > dist[i][k] + dist[k][j]) {
		    dist[i][j] = dist[i][k] + dist[k][j];
		    next[i][j] = next[i][k];
		    if (! directed) {
			dist[j][i] = dist[i][j];
			next[j][i] = next[k][j];
		    }
		}
	    }
	}
    }
    return [dist, next];
}

reorder.floyd_warshall_with_path = floyd_warshall_with_path;

reorder.floyd_warshall_path = function(next, u, v) {
    if (next[u][v] === undefined) return [];
    var path = [u];
    while (u != v) {
	u = next[u][v];
	path.push(u);
    }
    return path;
};
