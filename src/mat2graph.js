reorder.mat2graph = function(mat, directed) {
    var n = mat.length,
	nodes = [],
	links = [],
	max_value = Number.NEGATIVE_INFINITY,
	i, j, v, m;
    
    for (i = 0; i < n; i++)
	nodes.push({id: i});

    for (i = 0; i < n; i++) {
	v = mat[i];
	m = (directed) ? 0 : i;

	for (j = m; j < v.length; j++) {
	    if (j == nodes.length)
		nodes.push({id: j});
	    if (v[j] !== 0) {
		if (v[j] > max_value)
		    max_value = v[j];
		links.push({source: i, target: j, value: v[j]});
	    }
	}
    }
    return reorder.graph(nodes, links, directed)
	.linkDistance(function(l, i) {
	    return 1 + max_value - l.value;
	})
	.init();
};
