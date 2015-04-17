reorder.barycenter = function(graph, iter, comps) {
    var perm = [];
    // Compute the barycenter heuristic on each connected component
    if (! comps) {
	comps = graph.components();
    }
    for (var i = 0; i < comps.length; i++)
	perm = perm.concat(reorder.barycenter1(graph, comps[i], iter));
    return perm;
};

// Take the list of neighbor indexes and return the median according to 
// P. Eades and N. Wormald, Edge crossings in drawings of bipartite graphs.
// Algorithmica, vol. 11 (1994) 379–403.
function median(neighbors) {
    if (neighbors.length == 0)
	return -1; // should not happen
    if (neighbors.length == 1)
	return neighbors[0];
    if (neighbors.length == 2)
	return (neighbors[0]+neighbors[1])/2;
    neighbors.sort();
    if (neighbors.length % 2)
	return neighbors[(neighbors.length-1)/2];
    var rm = neighbors.length/2,
	lm = rm - 1,
	rspan = neighbors[neighbors.length-1] - neighbors[rm],
	lspan = neighbors[lm] - neighbors[0];
    if (lspan == rspan)
	return (neighbors[lm] + neighbors[rm])/2;
    else
	return (neighbors[lm]*rspan + neighbors[rm]*lspan) / (lspan+rspan);
}

// Wilhelm Barth, Petra Mutzel, Michael Jünger: 
// Simple and Efficient Bilayer Cross Counting.
// J. Graph Algorithms Appl. 8(2): 179-194 (2004)
function count_crossings(graph, north, south) {
    var i, j, southPos = [], n,
	firstIndex, treeSize, tree, cc, index, weightSum,
	invert = false;

    if (north.length < south.length) {
	var tmp = north;
	north = south;
	south = tmp;
	invert = true;
    }

    var south_inv = inverse_permutation(south);

    for (i = 0; i < north.length; i++) {
	if (invert)
	    n = graph.inEdges(north[i]);
	else
	    n = graph.outEdges(north[i]);
	n = n.map(function(e) {
	    if (invert)
		return south_inv[e.target.index];
	    return south_inv[e.source.index];
	});
	n.sort();
	southPos = southPos.concat(n);
    }
    
    firstIndex = 1;
    while (firstIndex < south.length)
	firstIndex <<= 1;
    treeSize = 2 * firstIndex - 1;
    firstIndex -= 1;
    tree = science.zeroes(treeSize);

    cc = 0;
    for (i = 0; i < southPos.length; i++) {
	index = southPos[i] + firstIndex;
	tree[index]++;
	while (index > 0) {
	    if (index%2) cc += tree[index+1];
	    index = (index - 1) >> 1;
	    tree[index]++;
	}
	
    }
    return cc;
}
reorder.count_crossings = count_crossings;

reorder.barycenter1 = function(graph, comp, iter) {
    var nodes = graph.nodes(),
	layer1, layer2,
	layer,
	i, v, neighbors;

    if (comp.length < 3)
	return comp;

    if (! iter)
	iter = 10;
    else if ((iter%2)==1)
	iter++; // want even number of iterations

    layer1 = comp.filter(function(n) {
	return graph.outEdges(n).length!=0;
    });
    layer2 = comp.filter(function(n) {
	return graph.inEdges(n).length!=0;
    });

    for (i = 0; i < layer2.length; i++)
	nodes[layer2[i]].pos = i;

    for (layer = layer1;
	 iter--;
	 layer = (layer == layer1) ? layer2 : layer1) {
	for (i = 0; i < layer.length; i++) {
	    // Compute the median/barycenter for this node and set
	    // its (real) value into node.mval
	    v = nodes[layer[i]];
	    if (layer == layer1)
		neighbors = graph.outEdges(v.index);
	    else
		neighbors = graph.inEdges(v.index);
	    neighbors = neighbors.map(function(e) {
		    var n = e.source == v ? e.target : e.source;
		    return nodes[n.index].pos;
	    });
	    v.median = median(neighbors);
	    //console.log('median['+i+']='+v.median);
	}
	layer.sort(function(a, b) {
	    var d = nodes[a].median - nodes[b].median;
	    if (d == 0) {
		// If both values are equal,
		// place the odd degree vertex on the left of the even
		// degree vertex
		d = (graph.edges(b).length%2) - (graph.edges(a).length%2);
	    }
	    if (d < 0) return -1;
	    else if (d > 0) return 1;
	    return 0;
	});
	for (i = 0; i < layer2.length; i++)
	    nodes[layer[i]].pos = i;
    }
    return [layer1, layer2];
};
