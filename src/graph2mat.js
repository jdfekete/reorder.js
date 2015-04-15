reorder.graph2mat = function(graph, directed) {
    var nodes = graph.nodes(),
	links = graph.links(),
	n = nodes.length,
	i, l, mat;

    if (! directed)
	directed = graph.directed();
    if (directed) {
	var row_perm = [], rows = 0, 
	    col_perm = [], cols = 0;
	
	for (i = 0; i < n; i++) {
	    if (graph.inEdges(i).length != 0)
		row_perm.push(rows++);
	    else
		row_perm.push(-1);

	    if (graph.outEdges(i).length != 0)
		col_perm.push(cols++);
	    else
		col_perm.push(-1);
	}
	mat = Array(rows);
	for (i = 0; i < rows; i++)
	    mat[i] = science.zeroes(cols);
	
	for (i = 0; i < links.length; i++) {
	    l = links[i];
	    mat[row_perm[l.source.index]][col_perm[l.target.index]] = l.value ? l.value : 1;
	}
    }
    else {
	mat = Array(n);
	for (i = 0; i < n; i++) 
	    mat[i] = science.zeroes(n);
	
	for (i = 0; i < links.length; i++) {
	    l = links[i];
	    mat[l.source.index][l.target.index] = l.value ? l.value : 1;
	}
    }
    return mat;
};
