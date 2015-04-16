reorder.mat2graph = function(mat, directed) {
    var n = mat.length,
	nodes = [],
	links = [],
	i, j, v, m;
    
    for (i = 0; i < n; i++)
	nodes.push({id: i});

    for (i = 0; i < n; i++) {
	v = mat[i];
	m = directed ? v.length : i+1;
	m = Math.min(m, v.length);
	for (j = 0; j < m; j++) {
	    if (j == nodes.length)
		nodes.push({id: j});
	    if (v[j] != 0) {
		links.push({source: i, target: j, value: v[j]});
	    }
	}
    }
    return reorder.graph(nodes, links, directed)
	.init();
};
