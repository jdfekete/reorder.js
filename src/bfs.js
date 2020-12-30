import { flatten, cmp_number } from './utils';

export function bfs(graph, v, fn) {
    var q = new Queue(),
	discovered = {}, i, e, v2, edges;
    q.push(v);
    discovered[v] = true;
    fn(v, undefined);
    while (q.length) {
	v = q.shift();
	fn(v, v);
	edges =	graph.edges(v);
	for (i = 0; i < edges.length; i++) {
	    e = edges[i];
	    v2 = graph.other(e, v).index;
	    if (! discovered[v2]) {
		q.push(v2);
		discovered[v2] = true;
		fn(v, v2);
	    }
	}
	fn(v, -1);
    }
};

export function bfs_distances(graph, v) {
    var dist = {};
    dist[v] = 0;
    bfs(graph, v, function(v, c) {
	if (c >= 0 && v != c)
	    dist[c] = dist[v]+1;
    });
    return dist;
};

export function all_pairs_distance_bfs(graph, comps) {
    if (! comps)
	comps = [ graph.nodes_indices() ];
    var nodes = comps.reduce(flatten)
	    .sort(cmp_number),
	mat = Array(nodes.length),
	i, j, dist;

    for (i = 0; i < nodes.length; i++)
	mat[i] = Array(nodes.length);

    for (i = 0; i < nodes.length; i++) {
	dist = bfs_distances(graph, i);
	for (j in dist) {
	    mat[i][j] = dist[j];
	    mat[j][i] = dist[j];
	}
    }
    return mat;
};

