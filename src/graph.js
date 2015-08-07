reorder.graph = function(nodes, links, directed) {
    var graph = {},
        linkDistance = 1,
        edges,
	inEdges, outEdges,
	components;

    graph.nodes = function(x) {
	if (!arguments.length) return nodes;
	nodes = x;
	return graph;
    };

    graph.nodes_indices = function() {
	return nodes.map(function(n) {
	    return n.index;
	});
    };

    graph.generate_nodes = function(n) {
	nodes = [];
	for (var i = 0; i < n; i++)
	    nodes.push({id: i});
	return graph;
    };

    graph.links = function(x) {
	if (!arguments.length) return links;
	links = x;
	return graph;
    };
    graph.links_indices = function() {
	return links.map(function(l) {
	    return { source: l.source.index,
		     target: l.target.index };
	});
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

	components = undefined;
	for (i = 0; i < n; ++i) {
	    (o = nodes[i]).index = i;
	    o.weight = 0;
	}

	for (i = 0; i < m; ++i) {
	    (o = links[i]).index = i;
	    if (typeof o.source == "number") o.source = nodes[o.source];
	    if (typeof o.target == "number") o.target = nodes[o.target];
	    if (! ('value' in o)) o.value = 1;
	    ++o.source.weight;
	    ++o.target.weight;
	}

	if (typeof linkDistance === "function")
	    for (i = 0; i < m; ++i)
		links[i].distance = +linkDistance.call(this, links[i], i);
	else
	    for (i = 0; i < m; ++i)
		links[i].distance = linkDistance;

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
	else {
	    inEdges = outEdges = edges;
	}

        for (i = 0; i < links.length; ++i) {
	    o = links[i];
	    edges[o.source.index].push(o);
	    if (o.source.index != o.target.index)
		edges[o.target.index].push(o);
	    if (directed)
		inEdges[o.source.index].push(o);
	    if (directed)
		outEdges[o.target.index].push(o);
	}

	return graph;
    }

    graph.init = init;

    graph.edges = function(node) { 
	if (typeof node != "number") {
	    node = node.index;
	    if (reorder.debug) {
		console.log('received node %d', node);
	    }
	}
	return edges[node]; 
    };

    graph.degree = function(node) { 
	if (typeof node != "number")
	    node = node.index;
	return edges[node].length; 
    };

    graph.inEdges = function (node) {
	if (typeof node != "number")
	    node = node.index;
	return inEdges[node];
    };

    graph.inDegree = function(node) {
	if (typeof node != "number")
	    node = node.index;
	return inEdges[node].length; 
    };

    graph.outEdges = function(node) {
	if (typeof node != "number")
	    node = node.index;
	return outEdges[node];
    };

    graph.outDegree = function(node) { 
	if (typeof node != "number")
	    node = node.index;
	return outEdges[node].length; 
    };

    graph.sinks = function() {
	var sinks = [],
	    i;

	for (i = 0; i < nodes.length; i++) {
	    if (graph.outEdges(i).length === 0)
		sinks.push(i);
	}
	return sinks;
    };

    graph.sources = function() {
	var sources = [],
	    i;

	for (i = 0; i < nodes.length; i++) {
	    if (graph.inEdges(i).length === 0)
		sources.push(i);
	}
	return sources;
    };

    function distance(i) {
	return links[i].distance;
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
	    if (nodes[j].comp !== 0)
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
		    if (o.comp === 0) {
			o.comp = comp;
			ccomp.push(o.index);
			stack.push(o.index);
		    }
		}
	    }
	    if (ccomp.length) {
		ccomp.sort(reorder.cmp_number);
		comps.push(ccomp);
	    }
	}
	comps.sort(function(a,b) { return b.length - a.length; });
	return comps;
    }

    graph.components = function() {
	if (! components)
	    components = compute_components();
	return components;
    };

    return graph;
};
