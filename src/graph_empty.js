function graph_empty_nodes(n) {
    var nodes = Array(n), i;
    for (i = 0; i < n; i++) 
	nodes[i] = {id: i};
    return nodes;
}

reorder.graph_empty_nodes = graph_empty_nodes;

reorder.graph_empty = function(n, directed) {
    return graph(graph_empty_nodes(n), [], directed);
};
