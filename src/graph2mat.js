reorder.graph2mat = function(graph, directed) {
    var nodes = graph.nodes(),
	links = graph.links(),
	n = nodes.length,
	i, l, mat;

    mat = Array(n);
    for (i = 0; i < n; i++) {
	mat[i] = science.zeroes(n);
    }
    for (i = 0; i < links.length; i++) {
	l = links[i];
	mat[l.source.index][l.target.index] = l.value ? l.value : 1;
	if (! directed)
	    mat[l.target.index][l.source.index] = l.value ? l.value : 1;
    }
    return mat;
};
