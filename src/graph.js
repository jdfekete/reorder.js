reorder.graph = function(nodes, links, directed) {
    var graph = {},
        linkDistance = 1,
        edges,
	inEdges, outEdges,
        distances,
	components;

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

    graph.directed = function(x) {
      if (!arguments.length) return directed;
      directed = x;
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

	if (directed) {
            inEdges = Array(nodes.length);
	    outEdges = Array(nodes.length);
            for (i = 0; i < nodes.length; ++i) {
		inEdges[i] = [];
		outEdges[i] = [];
	    }
	}

        for (i = 0; i < links.length; ++i) {
	    o = links[i];
	    edges[o.source.index].push(o);
	    if (directed)
		inEdges[o.source.index].push(o);
	    if (o.source.index != o.target.index)
		edges[o.target.index].push(o);
	    if (directed)
		outEdges[o.target.index].push(o);
	}

	return graph;
    }

    graph.init = init;

    graph.edges = function(node) { return edges[node]; };

    function inEdges(node) {
	if (directed)
	    return inEdges[node];
	return edges[node];
    }
    graph.inEdges = inEdges;

    function outEdges(node) {
	if (directed)
	    return outEdges[node];
	return edges[node];
    }
    graph.outEdges = outEdges;

    graph.sinks = function() {
	var sinks = [],
	    i;
	if (! directed)
	    return reorder.range(nodes.length);

	for (i = 0; i < nodes.length; i++) {
	    if (outEdges(i).length == 0)
		sinks.push(i);
	}
	return sinks;
    };

    graph.sources = function() {
	var sources = [],
	    i;
	if (! directed)
	    return reorder.range(nodes.length);

	for (i = 0; i < nodes.length; i++) {
	    if (inEdges(i).length == 0)
		sources.push(i);
	}
	return sources;
    };

    function distance(i) {
	return distances[i];
    }
    graph.distance = distance;

    function neighbors(node) {
	var e = edges[node], ret = [];
	for (var i = 0; i < e.length; ++i) {
	    var o = e[i];
	    if (o.source.index == node)
		ret.push(o.target);
	    else 
		ret.push(o.source);
	}
	return ret;
    }
    graph.neighbors = neighbors;

    graph.other = function(o, node) {
	if (typeof o == "number")
	    o = links[o];
	if (o.source.index == node)
	    return o.target;
	else 
	    return o.source;
    };

    function compute_components() {
	var stack = [],
	    comp = 0, comps = [], ccomp,
	    n = nodes.length,
	    i, j, v, l, o, e;

	for (i = 0; i < n; i++)
	    nodes[i].comp = 0;

	for (j = 0; j < n; j++) {
	    if (nodes[j].comp != 0)
		continue;
	    comp = comp+1; // next connected component
	    nodes[j].comp = comp;
	    stack.push(j);
	    ccomp = [j]; // current connected component list

	    while (stack.length) {
		v = stack.shift();
		l = edges[v];
		for (i = 0; i < l.length; i++) {
		    e = l[i];
		    o = e.source;
		    if (o.index == v)
			o = e.target;
		    if (o.index == v) // loop
			continue;
		    if (o.comp == 0) {
			o.comp = comp;
			ccomp.push(o.index);
			stack.push(o.index);
		    }
		}
	    }
	    if (ccomp.length) {
		ccomp.sort(function(a,b){ return a-b; });
		comps.push(ccomp);
	    }
	}
	return comps;
    }

    graph.components = function() {
	if (! components)
	    components = compute_components();
	return components;
    };

    return graph;
};
