reorder.graph = function(nodes, links) {
    var graph = {},
        linkDistance = 1,
        edges,
        distances;

    graph.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return graph;
    };
    graph.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return graph;
    };
    graph.linkDistance = function(x) {
	if (!arguments.length) return linkDistance;
	linkDistance = typeof x === "function" ? x : +x;
	return graph;
    };

    function init() {
	var i, o, n = nodes.length, m = links.length;

	for (i = 0; i < n; ++i) {
	    (o = nodes[i]).index = i;
	    o.weight = 0;
	}

	for (i = 0; i < m; ++i) {
	    (o = links[i]).index = i;
	    if (typeof o.source == "number") o.source = nodes[o.source];
	    if (typeof o.target == "number") o.target = nodes[o.target];
	    ++o.source.weight;
	    ++o.target.weight;
	}

	distances = [];
	if (typeof linkDistance === "function")
	    for (i = 0; i < m; ++i)
		distances[i] = +linkDistance.call(this, links[i], i);
	else
	    for (i = 0; i < m; ++i)
		distances[i] = linkDistance;

        edges = Array(nodes.length);
        for (i = 0; i < nodes.length; ++i) {
	    edges[i] = [];
        }
        for (i = 0; i < links.length; ++i) {
	    var o = links[i];
	    edges[o.source.index].push(o);
	    if (o.source.index != o.target.index)
		edges[o.target.index].push(o);
	}

	return graph;
    }
    graph.init = init;

    graph.edges = function(node) { return edges[node]; };

    function distance(i) {
	return distances[i];
    }
    graph.distance = distance;

    graph.neighbors = function(node) {
	var e = edges[node], ret = [];
	for (var i = 0; i < e.length; ++i) {
	    var o = e[i];
	    if (o.source.index == node)
		ret.push(o.target);
	    else 
		ret.push(o.source);
	}
	return ret;
    };

    graph.other = function(o, node) {
	if (typeof o == "number")
	    o = links[o];
	if (o.source.index == node)
	    return o.target;
	else 
	    return o.source;
    };

    return graph;
};
