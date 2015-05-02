reorder.graph2mat = function(graph, directed) {
    var nodes = graph.nodes(),
	links = graph.links(),
	n = nodes.length,
	i, l, mat;

    if (! directed)
	directed = graph.directed();
    if (directed) {
	var rows = n, 
	    cols = n;
	
	for (i = n-1; i >= 0; i--) {
	    if (graph.inEdges(i).length !== 0)
		break;
	    else
		rows--;
	}
	for (i = n-1; i >= 0; i--) {
	    if (graph.outEdges(i).length !== 0)
		break;
	    else
		cols--;
	}
	//console.log("Rows: "+rows+" Cols: "+cols);
	mat = reorder.zeroes(rows, cols);
	
	for (i = 0; i < links.length; i++) {
	    l = links[i];
	    mat[l.source.index][l.target.index] = l.value ? l.value : 1;
	}
    }
    else {
	mat = reorder.zeroes(n, n);
	
	for (i = 0; i < links.length; i++) {
	    l = links[i];
	    mat[l.source.index][l.target.index] = l.value ? l.value : 1;
	    mat[l.target.index][l.source.index] = l.value ? l.value : 1;
	}
    }
    return mat;
};
