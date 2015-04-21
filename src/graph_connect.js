reorder.graph_connect = function(graph, comps) {
    var i, j, links = graph.links();

    if (! comps)
	comps = graph.components();
    
    for (i = 0; i < (comps.length-1); i++) {
	for (j = i+1; j < comps.length; j++) {
	    links.push({source: comps[i][0], target: comps[j][0]});
	}
    }
    graph.links(links);
    return graph.init();
};
