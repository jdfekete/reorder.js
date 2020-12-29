export function graph_empty_nodes(n) {
    var nodes = Array(n), i;
    for (i = 0; i < n; i++) 
	nodes[i] = {id: i};
    return nodes;
}

export function graph_empty(n, directed) {
    return graph(graph_empty_nodes(n), [], directed);
};
