/**
 * Returns a list of distance matrices, computed for the specified
 * connected components of a graph, or all the components if none is
 * specified.
 * @param {Graph} graph - the graph
 * @param {Array} comps [optional] the specified connected component list
 * @returns {Array} a list of distance matrices, in the order of the
 * nodes in the list of connected components.
 */
reorder.all_pairs_distance = function(graph, comps) {
    var distances = [];
    if (! comps)
	comps = graph.components();

    for (var i = 0; i < comps.length; i++) 
	distances.push(all_pairs_distance_floyd_warshall(graph, comps[i]));
    return distances;
};

/**
 * Returns a distance matrix, computed for the specified
 * connected component of a graph.
 * @param {Graph} graph - the graph
 * @param {Array} comp - the connected component as a list of nodes
 * @returns {Matrix} a distance matrix, in the order of the
 * nodes in the list of connected components.
 */
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

reorder.all_pairs_distance_floyd_warshall = all_pairs_distance_floyd_warshall;

/**
 * Returns a distance matrix, computed for the specified
 * connected component of a graph, and the information to compute the
 * shortest paths.
 * @param {Graph} graph - the graph
 * @param {Array} comp - the connected component as a list of nodes
 * @returns {list} a distance matrix, in the order of the
 * nodes in the list of connected components, and a table used to
 * reconstruct the shortest paths with the {@link
 * floyd_warshall_path} function.
 */
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

/**
 * Returns the shortest path from node u to node v, from the table
 * returned by {@link floyd_warshall_with_path}.
 * @param {Array} next - the next information 
 * @param {Integer} u - the starting node
 * @param {Integer} v - the ending node
 * @return {list} a list of nodes in the shortest path from u to v
 */
function floyd_warshall_path(next, u, v) {
    if (next[u][v] === undefined) return [];
    var path = [u];
    while (u != v) {
	u = next[u][v];
	path.push(u);
    }
    return path;
}

reorder.floyd_warshall_path = floyd_warshall_path;
