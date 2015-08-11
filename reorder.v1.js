(function(exports){
reorder = {version: "0.0.8"}; // semver

reorder.debug = false;
// Use as: [4,3,2].sort(reorder.cmp_number_asc);
reorder.cmp_number_asc = function(a,b) { return a-b; };
reorder.cmp_number = reorder.cmp_number_asc;

// Use as: [4,3,2].sort(reorder.cmp_number_desc);
reorder.cmp_number_desc = function(a,b) { return b-a; };

// Use as: [[4,3],[2]].reduce(reorder.flaten);
reorder.flatten = function(a,b) { return a.concat(b); };

// Constructs a multi-dimensional array filled with Infinity.
reorder.infinities = function(n) {
    var i = -1,
	a = [];
    if (arguments.length === 1)
	while (++i < n)
	    a[i] = Infinity;
    else
	while (++i < n)
	    a[i] = reorder.infinities.apply(
		this, Array.prototype.slice.call(arguments, 1));
    return a;
};

reorder.array1d = function(n, v) {
    var i = -1,
	a = Array(n);
    while (++i < n)
	a[i] = v;
    return a;
};

function check_distance_matrix(mat, tol) {
    var i, j, v1, v2, n = mat.length, row;
    if (! tol)
	tol = 1e-10;

    if (n != mat[0].length)
	return "Inconsistent dimensions";
    
    for (i = 0; i < (n-1); i++) {
	row = mat[i];
	v1 = row[i];
	if (v1 < 0)
	    return "Negative value at diagonal "+i;
	if (v1 > tol)
	    return "Diagonal not zero at "+i;
	for (j = 1; j < n; j++) {
	    v1 = row[j];
	    v2 = mat[j][i];
	    if (Math.abs(v1 - v2) > tol)
		return "Inconsistency at "+i+","+j;
	    if (v1 < 0)
		return "Negative value at "+i+","+j;
	    if (v2 < 0)
		return "Negative value at "+j+","+i;
	}
    }
    return false;
}

function fix_distance_matrix(mat, tol) {
    var i, j, v1, v2, n = mat.length, row;
    if (! tol)
	tol = 1e-10;

    if (n != mat[0].length)
	throw "Inconsistent dimensions "+n+" != "+mat[0].length;
    
    for (i = 0; i < (n-1); i++) {
	row = mat[i];
	v1 = row[i];
	if (v1 < 0) {
	    if (-v1 > tol)
		throw "Negative value at diagonal"+i;
	    v1 = row[i] = 0;
	}
	else if (v1 > tol) {
	    throw "Diagonal not zero at "+i;
	}
	for (j = 1; j < n; j++) {
	    v1 = row[j];
	    v2 = mat[j][i];
	    if (Math.abs(v1 - v2) > tol)
		throw "Inconsistency at "+i+","+j;
	    if (v1 < 0)
		v1 = 0;
	    if (v2 < 0)
		v2 = 0;
	    if (v1 != v2) {
		v1 += v2;
		v1 /= 2;
	    }
	    row[j] = v1;
	    mat[j][i] = v1;
	}
    }
    return mat;
}
reorder.dot = science.lin.dot;
reorder.length = science.lin.length;
reorder.normalize = science.lin.normalize;
reorder.zeroes = science.zeroes;
reorder.displaymat = function(mat, rowperm, colperm) {
    var i, j, row, col, str;
    console.log('Matrix:');
    for (i = 0; i < mat.length; i++) {
	row = rowperm ? mat[rowperm[i]] : mat[i];
	str = "";
	for (j = 0; j < row.length; j++) {
	    col = colperm ? row[colperm[j]] : row[j];
	    str += col ? '*' : ' ';
	}
	console.log(str);
    }
};

reorder.printvec = function(row, prec, colperm, line) {
    var j;
    if (! line)
	line = "";
    for (j = 0; j < row.length; j++) {
	if (line.length !== 0)
	    line += ", ";
	if (colperm)
	    line += row[colperm[j]].toFixed(prec);
	else
	    line += row[j].toFixed(prec);
    }
    console.log(line);
};

reorder.printmat = function(m, prec, rowperm, colperm) {
    var i, j, row, line;
    if (! prec) prec=4;
    for (i = 0; i < m.length; i++) {
	row = rowperm ? m[rowperm[i]] : m[i];
	reorder.printvec(row, prec, colperm, i+": ");
    }
};

reorder.assert = function(v, msg) {
    if (! v) {
	console.log(msg);
	throw msg || "Assertion failed";
    }
};

reorder.printhcluster = function(cluster,indent) {
    if (cluster.left === null) 
	return  Array(indent+1).join(' ')+"id: "+cluster.id;

    return Array(indent+1).join(' ')
	+"id: "+cluster.id+", dist: "+cluster.dist+"\n"
	+reorder.printhcluster(cluster.left, indent+1)+"\n"
	+reorder.printhcluster(cluster.right, indent+1);
};
reorder.mean = science.stats.mean;

reorder.meantranspose = function(v, j) {
    var n = v.length;
    if (n === 0) return NaN;
    var o = v[0].length,
	m = 0,
	i = -1,
	row;

    while(++i < n) m += (v[i][j] - m) / (i+1);

    return m;
};

reorder.meancolumns = function(v) {
    var n = v.length;
    if (n === 0) return NaN;
    var o = v[0].length,
	m = v[0].slice(0),
	i = 0,
	j, row;

    while(++i < n) {
	row = v[i];
	for (j = 0; j < o; j++)
	    m[j] += (row[j] - m[j]) / (i+1);
    }

    return m;
};

function sum(v) {
    var i = v.length,
	s = 0;
    while(i-- > 0)
	if (! isNaN(v[i]))
	    s += v[i];
    return s;
}

reorder.sum = sum;
function isNum(a, b) {
    return !(isNaN(a) || isNaN(b) || a==Infinity || b == Infinity);
}
reorder.distance = {
    euclidean: function(a, b) {
	var i = a.length,
            s = 0,
            x;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		x = a[i] - b[i];
		s += x * x;
	    }
	}
	return Math.sqrt(s);
    },
    manhattan: function(a, b) {
	var i = a.length,
            s = 0;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		s += Math.abs(a[i] - b[i]);
	    }
	}
	return s;
    },
    minkowski: function(p) {
	return function(a, b) {
	    var i = a.length,
		s = 0;
	    while (i-- > 0) {
		if (isNum(a[i], b[i])) {
		    s += Math.pow(Math.abs(a[i] - b[i]), p);
		}
	    }
	    return Math.pow(s, 1 / p);
	};
    },
    chebyshev: function(a, b) {
	var i = a.length,
            max = 0,
            x;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		x = Math.abs(a[i] - b[i]);
		if (x > max) max = x;
	    }
	}
	return max;
    },
    hamming: function(a, b) {
	var i = a.length,
            d = 0;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		if (a[i] !== b[i]) d++;
	    }
	}
	return d;
    },
    jaccard: function(a, b) {
	var n = 0,
            i = a.length,
            s = 0;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		if (a[i] === b[i]) s++;
		n++;
	    }
	}
	if (n === 0) return 0;
	return s / n;
    },
    braycurtis: function(a, b) {
	var i = a.length,
            s0 = 0,
            s1 = 0,
            ai,
            bi;
	while (i-- > 0) {
	    ai = a[i];
	    bi = b[i];
	    if (isNum(ai, bi)) {
		s0 += Math.abs(ai - bi);
		s1 += Math.abs(ai + bi);
	    }
	}
	if (s1 === 0) return 0;
	return s0 / s1;
    }
};
reorder.range = function(start, stop, step) {
    if (arguments.length < 3) {
	step = 1;
	if (arguments.length < 2) {
	    stop = start;
	    start = 0;
	}
    }
    var range = [], i = start;
    if (step < 0)
	for (;i > stop; i += step)
	    range.push(i);
    else
	for (; i < stop; i += step)
	    range.push(i);
    return range;
};
reorder.transpose = science.lin.transpose;

reorder.transposeSlice = function(a, start, end) {
    if (arguments.length < 3) {
	end = a[0].length;
	if (arguments.length < 2) {
	    start = 0;
	}
    }
    var m = a.length,
	n = end,
	i = start-1,
	j,
	b = new Array(end-start);
    while (++i < n) {
	b[i] = new Array(m);
	j = -1; while (++j < m) b[i-start][j] = a[j][i];
    }
    return b;
};
reorder.correlation = {
    pearson: function(a, b) {
	var ma = science.stats.mean(a),
	    mb = science.stats.mean(b),
	    s1 = 0, s2 = 0, s3 = 0, i, dx, dy,
	    n = Math.min(a.length, b.length);
	if (n === 0)
	    return NaN;
	for (i = 0; i < n; i++) {
	    dx = (a[i] - ma);
	    dy = (b[i] - mb);
	    s1 += dx*dy;
	    s2 += dx*dx;
	    s3 += dy*dy;
	}
	return s1/Math.sqrt(s2*s3);
    },
    pearsonMatrix: function(matrix) {
	var a, ma,
	    i, j, dx, 
	    cor = reorder.correlation.pearson,
	    n = matrix.length, ret, mx, sx, sx2;
	if (n === 0)
	    return NaN;
	// do it the hard way for now, we'll optimize later
	ret = reorder.zeroes(n, n);
	for (i = 0; i < (n-1); i++) {
	    for (j = i+1; j < n; j++) {
		var p = cor(matrix[i], matrix[j]);
		ret[i][j] = ret[j][i] =p;
	    }
	}
	return ret;
	// mx = Array(n);
	// sx = reorder.zeroes(n);
	// sx2 = reorder.zeroes(n);
	// for (i = 0; i < n; i++) {
	//     mx[i] = science.stats.mean(matrix[i]);
	// }
	// for (i = 0; i < n; i++) {
	//     a = matrix[i];
	//     ma = mx[i];
	//     for (j = 0; j < n; j++) {
	// 	dx = (a[j] - ma);
	// 	sx[j] += dx;
	// 	sx2[j] += dx*dx;
	//     }
	// }
	// for (i = 0; i < n; i++) {
	//     ret[i] = Array(n);
	//     for (j = 0; j < n; j++) {
	// 	ret[i][j] = sx[i]*sx[j]/Math.sqrt(sx2[i]*sx2[j]);
	//     }
	// }
	// return ret;
    }
};
reorder.bandwidth = function(graph, order) {
    if (! order)
	order = reorder.range(graph.nodes().length);

    var inv = inverse_permutation(order),
	links = graph.links(),
	i, e, d, max = 0;

    for (i = 0; i < links.length; i++) {
	e = links[i];
	d = Math.abs(inv[e.source.index]-inv[e.target.index]);
	max = Math.max(max, d);
    }
    return max;
};
reorder.edgesum = function(graph, order) {
    if (! order)
	order = reorder.range(graph.nodes().length);

    var inv = inverse_permutation(order),
	links = graph.links(),
	i, e, d, sum = 0;

    for (i = 0; i < links.length; i++) {
	e = links[i];
	d = Math.abs(inv[e.source.index]-inv[e.target.index]);
	sum += d;
    }
    return sum;
};
reorder.permutation = reorder.range;


function inverse_permutation(perm, dense) {
    var inv = dense ? Array(perm.length) : {};
    for (var i = 0; i < perm.length; i++) {
	inv[perm[i]] = i;
    }
    return inv;
}

reorder.inverse_permutation = inverse_permutation;
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
reorder.graph_random_erdos_renyi = function(n, p, directed) {
    if (p <= 0)
	return reorder.graph_empty(n, directed);
    else if (p >= 1)
	return reorder.graph_complete(n, directed);

    var nodes = graph_empty_nodes(n),
	links = [],
	v, w, i, lr, lp;

    w = -1;
    lp = Math.log(1.0 - p);

    if (directed) {
	for (v = 0; v < n; ) {
	    lr = Math.log(1.0 - Math.random());
	    w = w + 1 + Math.floor(lr/lp);
	    if (v == w)
		w = w+1;
	    while (w >= n && v < n) {
		w = w - n;
		v = v + 1;
		if (v == w)
		    w = w+1;
	    }
	    if (v < n)
		links.push({source: v, target: w});
	}
    }
    else {
	for(v = 1; v < n; ) {
	    lr = Math.log(1.0 - Math.random());
	    w = w + 1 + Math.floor(lr/lp);
	    while (w >= v && v < n) {
		w = w - v;
		v = v + 1;
	    }
	    if (v < n)
		links.push({source: v, target: w});
	}
    }
    return reorder.graph(nodes, links, directed).init();
};

reorder.graph_random = reorder.graph_random_erdos_renyi;
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
reorder.complete_graph = function(n, directed) {
    var nodes = graph_empty_nodes(n),
	links = [],
	i, j;

    if (directed) {
	for (i = 0; i < n; i++) {
	    for (j = 0; j < n; j++) {
		if (i != j)
		    links.push({source: i, target: j });
	    }
	}
    }
    else {
	for (i = 0; i < (n-1); i++) {
	    for (j = i+1; j < n; j++) 
		links.push({source: i, target: j });
	}
    }
    return reorder.graph(nodes, links, directed).init();
};
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
reorder.bfs = function(graph, v, fn) {
    var q = new Queue(),
	discovered = {}, i, e, v2, edges;
    q.push(v);
    discovered[v] = true;
    fn(v, undefined);
    while (q.length) {
	v = q.shift();
	fn(v, v);
	edges =	graph.edges(v);
	for (i = 0; i < edges.length; i++) {
	    e = edges[i];
	    v2 = graph.other(e, v).index;
	    if (! discovered[v2]) {
		q.push(v2);
		discovered[v2] = true;
		fn(v, v2);
	    }
	}
	fn(v, -1);
    }
};

reorder.bfs_distances = function(graph, v) {
    var dist = {};
    dist[v] = 0;
    reorder.bfs(graph, v, function(v, c) {
	if (c >= 0 && v != c)
	    dist[c] = dist[v]+1;
    });
    return dist;
};

reorder.all_pairs_distance_bfs = function(graph, comps) {
    if (! comps)
	comps = [ graph.nodes_indices() ];
    var nodes = comps.reduce(reorder.flatten)
	    .sort(reorder.cmp_number),
	mat = Array(nodes.length),
	i, j, dist;

    for (i = 0; i < nodes.length; i++)
	mat[i] = Array(nodes.length);

    for (i = 0; i < nodes.length; i++) {
	dist = reorder.bfs_distances(graph, i);
	for (j in dist) {
	    mat[i][j] = dist[j];
	    mat[j][i] = dist[j];
	}
    }
    return mat;
};


/*jshint loopfunc:true */
bfs_order = function(graph, comps) {
    if (! comps)
	comps = graph.components();

    var i, comp, order = [];

    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	reorder.bfs(graph, comp[0], function(v, c) {
	    if (c >= 0 && v != c)
		order.push(v);
	});
    }
    return order;
};
reorder.mat2graph = function(mat, directed) {
    var n = mat.length,
	nodes = [],
	links = [],
	max_value = Number.NEGATIVE_INFINITY,
	i, j, v, m;
    
    for (i = 0; i < n; i++)
	nodes.push({id: i});

    for (i = 0; i < n; i++) {
	v = mat[i];
	m = (directed) ? 0 : i;

	for (j = m; j < v.length; j++) {
	    if (j == nodes.length)
		nodes.push({id: j});
	    if (v[j] !== 0) {
		if (v[j] > max_value)
		    max_value = v[j];
		links.push({source: i, target: j, value: v[j]});
	    }
	}
    }
    return reorder.graph(nodes, links, directed)
	.linkDistance(function(l, i) {
	    return 1 + max_value - l.value;
	})
	.init();
};
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
// Wilhelm Barth, Petra Mutzel, Michael Jünger: 
// Simple and Efficient Bilayer Cross Counting.
// J. Graph Algorithms Appl. 8(2): 179-194 (2004)
/*jshint loopfunc:true */
function count_crossings(graph, north, south) {
    var i, j, n,
	firstIndex, treeSize, tree, index, weightSum,
	invert = false, crosscount;

    var comp = reorder.permutation(graph.nodes().length);

    if (north===undefined) {
	north = comp.filter(function(n) { return graph.outDegree(n) !== 0; });
	south = comp.filter(function(n) { return graph.inDegree(n) !== 0; });
    }

    // Choose the smaller axis
    if (north.length < south.length) {
	var tmp = north;
	north = south;
	south = tmp;
	invert = true;
    }

    var south_inv = inverse_permutation(south),
	southsequence = [];

    for (i = 0; i < north.length; i++) {
	if (invert) {
	    n = graph.inEdges(north[i])
		.map(function(e) {
		    return south_inv[e.target.index];
		});
	}
	else {
	    n = graph.outEdges(north[i])
		.map(function(e) {
		    return south_inv[e.source.index];
		});
	}
	n.sort(reorder.cmp_number);
	southsequence = southsequence.concat(n);
    }
    
    firstIndex = 1;
    while (firstIndex < south.length)
	firstIndex <<= 1;
    treeSize = 2 * firstIndex - 1;
    firstIndex -= 1;
    tree = reorder.zeroes(treeSize);

    crosscount = 0;
    for (i = 0; i < southsequence.length; i++) {
	index = southsequence[i] + firstIndex;
	tree[index]++;
	while (index > 0) {
	    if (index%2) crosscount += tree[index+1];
	    index = (index - 1) >> 1;
	    tree[index]++;
	}
    }
    return crosscount;
}

reorder.count_crossings = count_crossings;
// Accorging to
// E. R. Gansner, E. Koutsofios, S. C. North, and K.-P. Vo. 1993. A
// Technique for Drawing Directed Graphs. IEEE Trans. Softw. Eng. 19, 3
// (March 1993), 214-230. DOI=10.1109/32.221135
// http://dx.doi.org/10.1109/32.221135 
// page 14: "[...] reduce obvious crossings after the vertices have
// been sorted, transforming a given ordering to one that is locally
// optimal with respect to transposition of adjacent vertices. It
// typically provides an additional 20-50% reduction in edge crossings.

function count_in_crossings(graph, v, w, inv) {
    var v_edges = graph.inEdges(v),
	w_edges = graph.inEdges(w),
	iv, iw, p0, cross = 0;

    for (iw = 0; iw < w_edges.length; iw++) {
	p0 = inv[w_edges[iw].target.index];
	for (iv = 0; iv < v_edges.length; iv++) {
	    if (inv[v_edges[iv].target.index] > p0)
		cross++;
	}
    }
    return cross;
}

function count_out_crossings(graph, v, w, inv) {
    var v_edges = graph.outEdges(v),
	w_edges = graph.outEdges(w),
	iv, iw, p0, cross = 0;

    for (iw = 0; iw < w_edges.length; iw++) {
	p0 = inv[w_edges[iw].source.index];
	for (iv = 0; iv < v_edges.length; iv++) {
	    if (inv[v_edges[iv].source.index] > p0)
		cross++;
	}
    }
    return cross;
}

/**
 * Optimize two layers by swapping adjacent nodes when
 * it reduces the number of crossings.
 * @param {Graph} graph - the graph these two layers belong to
 * @param {list} layer1 - the ordered list of nodes in layer 1
 * @param {list} layer2 - the ordered list of nodes in layer 2
 * @returns {list} a tuple containing the new layer1, layer2, and crossings count
 */
function adjacent_exchange(graph, layer1, layer2) {
    layer1 = layer1.slice();
    layer2 = layer2.slice();
    var i, v, w, c0, c1,
	inv_layer1 = inverse_permutation(layer1),
	inv_layer2 = inverse_permutation(layer2),
	swapped = true,
	improved = 0;

    while (swapped) {
	swapped = false;
	for (i = 0; i < layer1.length-1; i++) {
	    v = layer1[i];
	    w = layer1[i+1];
	    // should reduce the in crossing and the out crossing
	    // otherwise what we gain horizontally is lost vertically
	    c0 = count_out_crossings(graph, v, w, inv_layer2);
	    c1 = count_out_crossings(graph, w, v, inv_layer2);
	    if (c0 > c1) {
		layer1[i] = w;
		layer1[i+1] = v;
		inv_layer1[w] = i;
		inv_layer1[v] = i+1;
		swapped = true;
		improved += c0 - c1;
	    }
	}
	for (i = 0; i < layer2.length-1; i++) {
	    v = layer2[i];
	    w = layer2[i+1];
	    c0 = count_in_crossings(graph, v, w, inv_layer1);
	    c1 = count_in_crossings(graph, w, v, inv_layer1);
	    if (c0 > c1) {
		layer2[i] = w;
		layer2[i+1] = v;
		inv_layer2[w] = i;
		inv_layer2[v] = i+1;
		swapped = true;
		improved += c0 - c1;
	    }
	}
    }

    return [layer1, layer2, improved];
}

reorder.adjacent_exchange = adjacent_exchange;
reorder.barycenter_order = function(graph, comps, max_iter) {
    var orders = [[], [], 0];
    // Compute the barycenter heuristic on each connected component
    if (! comps) {
	comps = graph.components();
    }
    for (var i = 0; i < comps.length; i++) {
	var o = reorder.barycenter(graph, comps[i], max_iter);
	orders = [ orders[0].concat(o[0]),
		   orders[1].concat(o[1]),
		   orders[2]+o[2] ];
    }
    return orders;
};

// Take the list of neighbor indexes and return the median according to 
// P. Eades and N. Wormald, Edge crossings in drawings of bipartite graphs.
// Algorithmica, vol. 11 (1994) 379–403.
function median(neighbors) {
    if (neighbors.length === 0)
	return -1; // should not happen
    if (neighbors.length === 1)
	return neighbors[0];
    if (neighbors.length === 2)
	return (neighbors[0]+neighbors[1])/2;
    neighbors.sort(reorder.cmp_number);
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

reorder.barycenter = function(graph, comp, max_iter) {
    var nodes = graph.nodes(),
	layer1, layer2, crossings, iter,
	best_layer1, best_layer2, best_crossings, best_iter,
	layer, inv_layer = {},
	i, v, neighbors, med;

    layer1 = comp.filter(function(n) {
	return graph.outDegree(n) !== 0;
    });
    layer2 = comp.filter(function(n) {
	return graph.inDegree(n) !== 0;
    });
    if (comp.length < 3) {
	return [layer1, layer2,
		count_crossings(graph, layer1, layer2)];
    }

    if (! max_iter)
	max_iter = 24;
    else if ((max_iter%2)==1)
	max_iter++; // want even number of iterations

    inv_layer = inverse_permutation(layer2);

    best_crossings = count_crossings(graph, layer1, layer2);
    best_layer1 = layer1.slice();
    best_layer2 = layer2.slice();
    best_iter = 0;    
    var inv_neighbor = function(e) {
	  var n = e.source == v ? e.target : e.source;
	  return inv_layer[n.index];
        },
	barycenter_sort = function(a, b) {
	    var d = med[a] - med[b];
	    if (d === 0) {
		// If both values are equal,
		// place the odd degree vertex on the left of the even
		// degree vertex
		d = (graph.edges(b).length%2) - (graph.edges(a).length%2);
	    }
	    if (d < 0) return -1;
	    else if (d > 0) return 1;
	    return 0;
	};

    for (layer = layer1, iter = 0;
	 iter < max_iter;
	 iter++, layer = (layer == layer1) ? layer2 : layer1) {
	med = {};
	for (i = 0; i < layer.length; i++) {
	    // Compute the median/barycenter for this node and set
	    // its (real) value into node.pos
	    v = nodes[layer[i]];
	    if (layer == layer1)
		neighbors = graph.outEdges(v.index);
	    else
		neighbors = graph.inEdges(v.index);
	    neighbors = neighbors.map(inv_neighbor);
	    med[v.index] = +median(neighbors);
	    //console.log('median['+i+']='+med[v.index]);
	}
	layer.sort(barycenter_sort);
	for (i = 0; i < layer.length; i++)
	    inv_layer = inverse_permutation(layer);
	crossings = count_crossings(graph, layer1, layer2);
	if (crossings < best_crossings) {
	    best_crossings = crossings;
	    best_layer1 = layer1.slice();
	    best_layer2 = layer2.slice();
	    best_iter = iter;
	    max_iter = Math.max(max_iter, iter + 2); // we improved so go on
	}
    }
    if (reorder.debug) {
	console.log('Best iter: '+best_iter);
    }

    return [best_layer1, best_layer2, best_crossings];
};
/**
 * Returns a list of distance matrices, computed for the specified
 * connected components of a graph, or all the components if none is
 * specified.
 * @param {Graph} graph - the graph
 * @param {Array} comps [optional] the specified connected component list
 * @returns {Array} a list of distance matrices, in the order of the
 * nodes in the list of connected components.
 */
reorder.all_pairs_distance = function(graph, comps) {
    var distances = [];
    if (! comps)
	comps = graph.components();

    for (var i = 0; i < comps.length; i++) 
	distances.push(all_pairs_distance_floyd_warshall(graph, comps[i]));
    return distances;
};

/**
 * Returns a distance matrix, computed for the specified
 * connected component of a graph.
 * @param {Graph} graph - the graph
 * @param {Array} comp - the connected component as a list of nodes
 * @returns {Matrix} a distance matrix, in the order of the
 * nodes in the list of connected components.
 */
function all_pairs_distance_floyd_warshall(graph, comp) {
    var dist = reorder.infinities(comp.length, comp.length),
	i, j, k, inv;
    // Floyd Warshall, 
    // see http://ai-depot.com/BotNavigation/Path-AllPairs.html
    // O(n^3) unfortunately

    inv = inverse_permutation(comp);

    for (i = 0; i < comp.length; i++)
	dist[i][i] = 0;
    
    var build_dist = function(e) {
	if (e.source == e.target) return;
	if (! (e.source.index in inv) || ! (e.target.index in inv))
	    return; // ignore edges outside of comp
	var u = inv[e.source.index],
	    v = inv[e.target.index];
	dist[v][u] = dist[u][v] = graph.distance(e.index);
    };
    for (i = 0; i < comp.length; i++) {
	graph.edges(comp[i]).forEach(build_dist);
    }

    for (k=0; k<comp.length; k++) {
	for (i=0; i<comp.length; i++)
	    if (dist[i][k] != Infinity) {
		for (j=0; j<comp.length; j++)
		    if (dist[k][j] != Infinity
			&& dist[i][j] > dist[i][k] + dist[k][j]) {
			dist[i][j] = dist[i][k] + dist[k][j];
			dist[j][i] = dist[i][j];
		    }
	    }
    }
    return dist;
}

reorder.all_pairs_distance_floyd_warshall = all_pairs_distance_floyd_warshall;

/**
 * Returns a distance matrix, computed for the specified
 * connected component of a graph, and the information to compute the
 * shortest paths.
 * @param {Graph} graph - the graph
 * @param {Array} comp - the connected component as a list of nodes
 * @returns {list} a distance matrix, in the order of the
 * nodes in the list of connected components, and a table used to
 * reconstruct the shortest paths with the {@link
 * floyd_warshall_path} function.
 */
function floyd_warshall_with_path(graph, comp) {
    if (! comp)
	comp = graph.components()[0];

    var dist = reorder.infinities(comp.length, comp.length),
	next = Array(comp.length),
	directed = graph.directed(),
	i, j, k, inv;
    // Floyd Warshall, 
    // see http://ai-depot.com/BotNavigation/Path-AllPairs.html
    // O(n^3) unfortunately

    inv = inverse_permutation(comp);
    
    for (i = 0; i < comp.length; i++) {
	dist[i][i] = 0;
	next[i] = Array(comp.length);
    }
    
    var build_dist = function(e) {
	if (e.source == e.target) return;
	var u = inv[e.source.index],
	    v = inv[e.target.index];
	dist[u][v] = graph.distance(e);
	next[u][v] = v;
	if (! directed) {
	    dist[v][u] = graph.distance(e);
	    next[v][u] = u;
	}
    };
    
    for (i = 0; i < comp.length; i++) {
	graph.edges(comp[i]).forEach(build_dist);
    }

    for (k=0; k<comp.length; k++) {
	for (i=0; i<comp.length; i++) {
	    for (j=0; j<comp.length; j++) {
		if (dist[i][j] > dist[i][k] + dist[k][j]) {
		    dist[i][j] = dist[i][k] + dist[k][j];
		    next[i][j] = next[i][k];
		    if (! directed) {
			dist[j][i] = dist[i][j];
			next[j][i] = next[k][j];
		    }
		}
	    }
	}
    }
    return [dist, next];
}

reorder.floyd_warshall_with_path = floyd_warshall_with_path;

/**
 * Returns the shortest path from node u to node v, from the table
 * returned by {@link floyd_warshall_with_path}.
 * @param {Array} next - the next information 
 * @param {Integer} u - the starting node
 * @param {Integer} v - the ending node
 * @return {list} a list of nodes in the shortest path from u to v
 */
function floyd_warshall_path(next, u, v) {
    if (next[u][v] === undefined) return [];
    var path = [u];
    while (u != v) {
	u = next[u][v];
	path.push(u);
    }
    return path;
}

reorder.floyd_warshall_path = floyd_warshall_path;
// Converts a graph with weighted edges (weight in l.value)
// into a distance matrix suitable for reordering with e.g.
// Optimal Leaf Ordering.

function distmat2valuemat(distmat) {
    var n = distmat.length,
	valuemat = reorder.zeroes(n, n),
	max_dist = reorder.distmax(distmat),
	i, j;

    for (i = 0; i < n; i++) {
	for (j = i; j < n; j++) {	    
	    valuemat[j][i] = valuemat[i][j] = 1+max_dist - distmat[i][j];
	}
    }
    return valuemat;
}
reorder.distmat2valuemat = distmat2valuemat;

reorder.graph2valuemats = function(graph, comps) {
    if (! comps)
	comps = graph.components();

    var	dists = reorder.all_pairs_distance(graph, comps);
    return dists.map(distmat2valuemat);
};

reorder.valuemats_reorder = function(valuemats, leaforder, comps) {
    var orders = valuemats.map(leaforder);

    if (comps) {
	orders = orders.map(function(d, i) {
	    return reorder.permute(comps[i], d);
	});
    }
    return orders.reduce(reorder.flatten);
};
reorder.dist = function() {
    var distance = reorder.distance.euclidean;

    function dist(vectors) {
	var n = vectors.length,
            distMatrix = [];

	for (var i = 0; i < n; i++) {
	    var d = [];
	    distMatrix[i] = d;
	    for (var j = 0; j < n; j++) {
		if (j < i) {
		     d.push(distMatrix[j][i]);
		} 
		else if (i === j) {
		    d.push(0);
		}
		else {
		    d.push(distance(vectors[i] , vectors[j]));
		}
	    }
	}
	return distMatrix;
    }

    dist.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	return dist;
    };

    return dist;
};

reorder.distmax = function (distMatrix) {
    var max = 0,
	n=distMatrix.length,
	i, j, row;

    for (i = 0; i < n; i++) {
	row = distMatrix[i];
	for (j = i+1; j < n; j++)
	    if (row[j] > max)
		max = row[j];
    }
    return max;
};

reorder.distmin = function(distMatrix) {
    var min = Infinity,
	n=distMatrix.length,
	i, j, row;

    for (i = 0; i < n; i++) {
	row = distMatrix[i];
	for (j = i+1; j < n; j++)
	    if (row[j] < min)
		min = row[j];
    }
    return min;
};


reorder.dist_remove = function(dist, n, m) {
    if (arguments.length < 3)
	m = n+1;
    var i;
    dist.splice(n, m-n);
    for (i = dist.length; i-- > 0; )
	dist[i].splice(n, m-n);
    return dist;
};
/* Fisher-Yates shuffle.
   See http://bost.ocks.org/mike/shuffle/
 */
reorder.randomPermute = function(array, i, j) {
    if (arguments.length < 3) {
	j = array.length;
	if (arguments.length < 2) {
	    i = 0;
	}
    }
    var m = j-i, t, k;
    while (m > 0) {
	k = i+Math.floor(Math.random() * m--);
	t = array[i+m];
	array[i+m] = array[k];
	array[k] = t;
    }
    return array;
};

reorder.randomPermutation = function(n) {
    return reorder.randomPermute(reorder.permutation(n));
};

reorder.random_array = function(n, min, max) {
    var ret = Array(n);
    if (arguments.length == 1) {
	while(n) ret[--n] = Math.random();
    }
    else if (arguments.length == 2) {
	while(n) ret[--n] = Math.random()*min;
    }
    else {
	while(n) ret[--n] = min + Math.random()*(max-min);
    }
    return ret;
};

reorder.random_matrix = function(p, n, m, sym) {
    if (! m)
	m = n;
    if (n != m)
	sym = false;
    else if (! sym)
	sym = true;
    var mat = reorder.zeroes(n, m), i, j, cnt;

    if (sym) {
	for (i = 0; i < n; i++) {
	    cnt = 0;
	    for (j = 0; j < i+1; j++) {
		if (Math.random() < p) {
		    mat[i][j] = mat[j][i] = 1;
		    cnt++;
		}
	    }
	    if (cnt === 0) {
		j = Math.floor(Math.random()*n/2);
		mat[i][j] = mat[j][i] = 1;
	    }
	}
    }
    else {
	for (i = 0; i < n; i++) {
	    cnt = 0;
	    for (j = 0; j < m; j++) {
		if (Math.random() < p) {
		    mat[i][j] = 1;
		    cnt++;
		}
	    }
	    if (cnt === 0)
		mat[i][Math.floor(Math.random()*m)] = 1;
	}
    }
    return mat;
};

function permute_copy(list, perm) {
    var m = perm.length;
    var copy = list.slice();
    while (m--)
	copy[m] = list[perm[m]];
    return copy;
}
reorder.permute = permute_copy;

function permute_inplace(list, perm) {
    var i, j, v, tmp;

    //list = list.slice();
    for (i = 0; i < list.length; i++) {
	j = perm[i];
	if (j < 0) {
	    perm[i] = -1 - j;
	    continue;
	}
	v = i;
	while (j != i) {
	    tmp = list[j]; 
	    list[j] = list[v];
	    list[v] = tmp;
	    v = j;
	    tmp = perm[j];
	    perm[j] = -1 - tmp;
	    j = tmp;
	}
    }
    return list;
}
reorder.permute_inplace = permute_inplace;

reorder.permutetranspose = function(array, indexes) {
    var m = array.length;
    while (m-- > 0)
	array[m] = reorder.permute(array[m], indexes);
    return array;
};

reorder.stablepermute = function(list, indexes) {
    var p = reorder.permute(list, indexes);
    if (p[0] > p[p.length-1]) {
	p.reverse();
    }
    return p;
};
reorder.sort_order = function(v) {
    return reorder.permutation(0, v.length).sort(
	function(a,b) { return v[a] - v[b]; });
};
if (typeof science == "undefined") {
    science = {version: "1.9.1"}; // semver [jdf] should be defined
    science.stats = {};
}

science.stats.hcluster = function() {
  var distance = reorder.distance.euclidean,
      linkage = "single", // single, complete or average
      distMatrix = null;

  function hcluster(vectors) {
    var n = vectors.length,
        dMin = [],
        cSize = [],
//        distMatrix = [],
        clusters = [],
        c1,
        c2,
        c1Cluster,
        c2Cluster,
        p,
        root,
        i,
        j,
	id = 0;

    // Initialise distance matrix and vector of closest clusters.
      if (distMatrix === null) {
	  distMatrix = [];
	  i = -1; while (++i < n) {
	      dMin[i] = 0;
	      distMatrix[i] = [];
	      j = -1; while (++j < n) {
		  distMatrix[i][j] = i === j ? Infinity : distance(vectors[i] , vectors[j]);
		  if (distMatrix[i][dMin[i]] > distMatrix[i][j]) dMin[i] = j;
	      }
	  }
      }
      else {
	  if (distMatrix.length < n || distMatrix[0].length < n)
	      throw {error: "Provided distance matrix length "+distMatrix.length+" instead of "+n};
	  i = -1; while (++i < n) {
	      dMin[i] = 0;
	      j = -1; while (++j < n) {
		  if (i === j)
		      distMatrix[i][j] = Infinity;
		  if (distMatrix[i][dMin[i]] > distMatrix[i][j]) dMin[i] = j;
	      }
	  }
      }
    // create leaves of the tree
    i = -1; while (++i < n) {
	if (i != id) console.log("i = %d, id = %d", i, id);
      clusters[i] = [];
      clusters[i][0] = {
        left: null,
        right: null,
        dist: 0,
        centroid: vectors[i],
	id: id++, //[jdf] keep track of original data index
        size: 1,
        depth: 0
      };
      cSize[i] = 1;
    }

    // Main loop
    for (p = 0; p < n-1; p++) {
      // find the closest pair of clusters
      c1 = 0;
      for (i = 0; i < n; i++) {
        if (distMatrix[i][dMin[i]] < distMatrix[c1][dMin[c1]]) c1 = i;
      }
      c2 = dMin[c1];

      // create node to store cluster info 
      c1Cluster = clusters[c1][0];
      c2Cluster = clusters[c2][0];

      var newCluster = {
        left: c1Cluster,
        right: c2Cluster,
        dist: distMatrix[c1][c2],
        centroid: calculateCentroid(c1Cluster.size, c1Cluster.centroid,
          c2Cluster.size, c2Cluster.centroid),
	id: id++,
        size: c1Cluster.size + c2Cluster.size,
        depth: 1 + Math.max(c1Cluster.depth, c2Cluster.depth)
      };
      clusters[c1].splice(0, 0, newCluster);
      cSize[c1] += cSize[c2];

      // overwrite row c1 with respect to the linkage type
      for (j = 0; j < n; j++) {
        switch (linkage) {
          case "single":
            if (distMatrix[c1][j] > distMatrix[c2][j])
              distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j];
            break;
          case "complete":
            if (distMatrix[c1][j] < distMatrix[c2][j])
              distMatrix[j][c1] = distMatrix[c1][j] = distMatrix[c2][j];
            break;
          case "average":
            distMatrix[j][c1] = distMatrix[c1][j] = (cSize[c1] * distMatrix[c1][j] + cSize[c2] * distMatrix[c2][j]) / (cSize[c1] + cSize[j]);
            break;
        }
      }
      distMatrix[c1][c1] = Infinity;

      for (i = 0; i < n; i++)
        distMatrix[i][c2] = distMatrix[c2][i] = Infinity;

      // update dmin and replace ones that previous pointed to c2 to point to c1
      for (j = 0; j < n; j++) {
        if (dMin[j] == c2) dMin[j] = c1;
        if (distMatrix[c1][j] < distMatrix[c1][dMin[c1]]) dMin[c1] = j;
      }

      // keep track of the last added cluster
      root = newCluster;
    }

    return root;
  }

  hcluster.linkage = function(x) {
    if (!arguments.length) return linkage;
    linkage = x;
    return hcluster;
  };

  hcluster.distance = function(x) {
    if (!arguments.length) return distance;
    distance = x;
    return hcluster;
  };

  hcluster.distanceMatrix = function(x) {
    if (!arguments.length) return distMatrix;
    distMatrix = x.map(function(y) { return y.slice(0); });
    return hcluster;
  };

  return hcluster;
};

function calculateCentroid(c1Size, c1Centroid, c2Size, c2Centroid) {
  var newCentroid = [],
      newSize = c1Size + c2Size,
      n = c1Centroid.length,
      i = -1;
  while (++i < n) {
    newCentroid[i] = (c1Size * c1Centroid[i] + c2Size * c2Centroid[i]) / newSize;
  }
  return newCentroid;
}
/**
 * optimal dendrogram ordering
 * 
 * implementation of binary tree ordering described in [Bar-Joseph et al., 2003]
 * by Renaud Blanch.
 * JavaScript translation by Jean-Daniel Fekete.
 * 
 * [Bar-Joseph et al., 2003]
 * K-ary Clustering with Optimal Leaf Ordering for Gene Expression Data.
 * Ziv Bar-Joseph, Erik D. Demaine, David K. Gifford, Angèle M. Hamel,
 * Tommy S. Jaakkola and Nathan Srebro
 * Bioinformatics, 19(9), pp 1070-8, 2003
 * http://www.cs.cmu.edu/~zivbj/compBio/k-aryBio.pdf
 */

reorder.optimal_leaf_order = function() {
    var distanceMatrix = null,
        distance = reorder.distance.euclidean,
	linkage = "complete",
        leavesMap = {},
        orderMap = {};

    function isLeaf(n) {
	return n.depth === 0;
    }

    function leaves(n) {
	if (n === null) return [];
	if (n.id in leavesMap)
	    return leavesMap[n.id];
	return (leavesMap[n.id] = _leaves(n));
    }

    function _leaves(n) {
	if (n === null) return [];
	if (n.depth === 0) return [n.id];
	return leaves(n.left).concat(leaves(n.right));
    }

    function order(v, i, j) {
	var key = "k"+v.id + "-"+i+"-"+j; // ugly key
	if (key in orderMap) 
	    return orderMap[key];
	return (orderMap[key] = _order(v, i, j));
    }
    
    function _order(v, i, j) {
	if (v.depth === 0) //isLeaf(v))
	    return [0, [v.id]];
	var l = v.left, r = v.right;
	var L = leaves(l), R = leaves(r);
	
	var w, x;
	if (L.indexOf(i) !== -1 && R.indexOf(j) !== -1) {
	    w = l; x = r;	    
	}
	else if (R.indexOf(i) !== -1 && L.indexOf(j) !== -1) {
	    w = r; x = l;
	}
	else 
	    throw {error: "Node is not common ancestor of "+i+", "+j};
	var Wl = leaves(w.left), Wr = leaves(w.right);
	var Ks = Wr.indexOf(i) != -1 ? Wl : Wr;
	if (Ks.length === 0) 
	    Ks = [i];

	var Xl = leaves(x.left), Xr = leaves(x.right);
	var Ls = Xr.indexOf(j) != -1 ? Xl : Xr;
	if (Ls.length === 0)
	    Ls = [j];

	var min = Infinity, optimal_order = [];

	for (var k = 0; k < Ks.length; k++) {
	    var w_min = order(w, i, Ks[k]);
	    for (var m = 0; m < Ls.length; m++) {
		var x_min = order(x, Ls[m], j);
		var dist = w_min[0] + distanceMatrix[Ks[k]][Ls[m]] + x_min[0];
		if (dist < min) {
		    min = dist;
		    optimal_order = w_min[1].concat(x_min[1]);
		}
	    }
	}
	return [min, optimal_order];
    }

    function orderFull(v) {
        leavesMap = {};
        orderMap = {};
	var min = Infinity,
	    optimal_order = [],
	    left = leaves(v.left),
	    right = leaves(v.right);
	
	if (reorder.debug)
	    console.log(reorder.printhcluster(v,0));

	for (var i = 0; i < left.length; i++) {
	    for (var j = 0; j < right.length; j++) {
		var so = order(v, left[i], right[j]);
		if (so[0] < min) {
		    min = so[0];
		    optimal_order = so[1];
		}
	    }
	}
	distanceMatrix = null;
	return optimal_order;
    }
    optimal_leaf_order.order = orderFull;

    function optimal_leaf_order(matrix) {
	if (distanceMatrix === null)
	    distanceMatrix = (reorder.dist().distance(distance))(matrix);
	var hcluster = science.stats.hcluster()
		.linkage(linkage)
		.distanceMatrix(distanceMatrix);
	return orderFull(hcluster(matrix));
    }

    optimal_leaf_order.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	distanceMatrix = null;
	return optimal_leaf_order;
    };

    optimal_leaf_order.linkage = function(x) {
	if (!arguments.length) return linkage;
	linkage = x;
	return optimal_leaf_order;
    };

    optimal_leaf_order.distance_matrix = function(x) {
	if (!arguments.length) return distanceMatrix;
	// copy
	distanceMatrix = x.map(function(y) { return y.slice(0); });
	return optimal_leaf_order;
    };
    optimal_leaf_order.distanceMatrix = optimal_leaf_order.distance_matrix; // compatibility

    return optimal_leaf_order;
};



reorder.order = function() {
    var distance = reorder.distance.euclidean,
        ordering = reorder.optimal_leaf_order,
        linkage = "complete",
        distanceMatrix = null,
        vector,
        except = [],
        debug = 0,
        i = 0, j = Infinity;


    function _reset() {
        distance = reorder.distance.euclidean;
        ordering = reorder.optimal_leaf_order;
        linkage = "complete";
        distanceMatrix = null;
        vector = null;
        except = [];
        i = 0;
        j = Infinity;
    }

    function order(v) {
        vector = v;
        j = Math.min(j, v.length);
        var i0 = (i > 0 ? i-1 : 0),
            j0 = (j < vector.length ? j+1: j),
            k, low, high;

        for (k = except.length-1; k > 0 ; k -= 2) {
            low = except[k-1];
            high = except[k];
            if (high >= j0) {
                if (j0 > j) {
                    j0 = Math.min(j0, low+1);
                    except.splice(k-1, 2);
                }
                else {
                    high = j0;
                }
            }
            else if (low <= i0) {
                if (i0 < i) {
                    i0 = Math.max(i0, high-1);
                    except.splice(k-1, 2);
                }
                else {
                    low = i0;
                }
            }
            else if ((high-low) < 3)
                except.splice(k-1, 2);
        }

        try {
            return _order_limits(i0, j0);
        }
        finally {
            _reset();
        }
    }

    function _order_limits(i0, j0) {
        var orig = vector,
            perm,
            row,
            k,
            l;

        vector = vector.slice(i0, j0); // always make a copy
        if (i === 0 && j == vector.length)
            return _order_except();

        if (reorder.debug)
            console.log("i0="+i0+" j0="+j0);

        if (distanceMatrix !== null) {
            if (j0 !== vector.length)
                reorder.dist_remove(distanceMatrix, j0, vector.length);
            if (i0 > 0)
                reorder.dist_remove(distanceMatrix, 0, i0);
        }
        else {
            _compute_dist();
        }
        // Apply constraints on the min/max indices

        var max = reorder.distmax(distanceMatrix);
        if (i0 < i) {
            // row i0 should be far away from each rows so move it away
            // by changing the distance matrix, adding "max" to each
            // distance from row/column 0 
            row = distanceMatrix[0];
            for (k = row.length; k-- > 1; )
                row[k] += max;
            for (k = distanceMatrix.length; k-- > 1; )
                distanceMatrix[k][0] += max;
            max += max;
            // also fix the exception list
            if (i0 !== 0) {
                for (k = 0; k < except.length; k++)
                    except[k] -= i0;
            }
        }
        if (j0 > j) {
            // move j0 even farther so that
            // i0 and j0 are farthest from each other.
            // add 2*max to each distance from row/col
            // j-i-1
            l = distanceMatrix.length-1;
            row = distanceMatrix[l];
            for (k = l; k-- > 0; ) {
                row[k] += max;
                distanceMatrix[k][l] += max;
            }
        }
        // the algorithm should work as is, except
        // the order can be reversed in the end.

        perm = _order_except();
        if (i0 < i) {
            if (perm[0] !== 0)
                perm.reverse();
            if (j0 > j) {
                reorder.assert(perm[0] === 0 && perm[perm.length-1]==perm.length-1,
                       "Invalid constrained permutation endpoints");
            }
            else {
                reorder.assert(perm[0] === 0,
                       "Invalid constrained permutation start");
            }
        }
        else if (j0 > j) {
            if (perm[perm.length-1] !== (perm.length-1))
                perm = perm.reverse();
            reorder.assert(perm[perm.length-1] == perm.length-1,
                           "Invalid constrained permutation end");
        }
        if (i0 !== 0) {
            perm = reorder
                .permutation(i0)
                .concat(perm.map(function(v) { return v + i0; }));
        }
        if (orig.length > j0) {
            perm = perm.concat(reorder.range(j0, orig.length));
        }
        return perm;
    }

    function _order_except() {
        var perm,
            k,
            l,
            low,
            high,
            pos;

        if (except.length === 0)
            return _order_equiv();

        // TODO: postpone the calculation to avoid computing the except items
        _compute_dist();
        // Apply constaints on the fixed order between the indices
        // in "except" 
        // We do it end-to-start to keep the indices right

        for (k = except.length-1; k > 0 ; k -= 2) {
            low = except[k-1];
            high = except[k];
            distanceMatrix = reorder.dist_remove(distanceMatrix, low+1, high-1);
            vector.splice(low+1, high-low-2);
            if (reorder.debug)
                console.log("Except["+low+", "+high+"]");
            if (distanceMatrix[low][low+1] !== 0) {
                // boundaries are equal, they will survive
                distanceMatrix[low][low+1] = distanceMatrix[low+1][low] = -1;
            }
        }
        
        perm = _order_equiv();

        // put back except ranges
        //TODO
        for (k = 0; k < except.length ; k += 2) {
            low = except[k];
            high = except[k+1];
            // Prepare for inserting range [low+1,high-1]
            for (l = 0; l < perm.length; l++) {
                if (perm[l] > low)
                    perm[l] += (high-low-2);
                else if (perm[l] == low)
                    pos = l;
            }
            if (pos > 0 && perm[pos-1] == (high-1)) {
                // reversed order
                Array.prototype.splice
                    .apply(perm,
                           [pos, 0].concat(reorder.range(high-2,low,-1)));
            }
            else if (perm[pos+1] == (high-1)) {
                Array.prototype.splice
                    .apply(perm,
                           [pos+1, 0].concat(reorder.range(low+1,high-1)));
            }
            else {
                throw "Range not respected";
            }
        }

        return perm;
    }

    function _order_equiv() {
        var perm,
            row,
            e,
            j,
            k,
            l,
            m,
            n,
            has_1 = false,
            equiv = [],
            fix_except = {};

        _compute_dist();

        // Collect nodes with distance==0 in equiv table
        // At this stage, exceptions are stored with -1
        for (k = 0; k < (distanceMatrix.length-1); k++) {
            row = distanceMatrix[k];
            e = [];
            j = row.indexOf(-1);
            if (j !== -1) {
                fix_except[k] = [k,j]; // keep track for later fix
                has_1 = true;
            }
            // top down to keep the indices
            for (l = row.length; --l >  k; ) {
                if (row[l] === 0) {
                    j = distanceMatrix[l].indexOf(-1);
                    if (j !== -1) {
                        // move the constraint to the representative
                        // of the equiv. class "k"
                        fix_except[k] = [l,j]; // keep track for later fix
                        distanceMatrix[j][k] = row[j] = -1;
                        has_1 = true;
                    }
                    e.unshift(l);
                    // remove equivalent item from dist and vector
                    distanceMatrix = reorder.dist_remove(distanceMatrix, l);
                    vector.splice(l, 1);
                }
                else if (row[l] < 0)
                    has_1 = true;
            }
            if (e.length !== 0) {
                e.unshift(k);
                equiv.push(e);
            }
        }

        if (has_1) {
            for (k = 0; k < (distanceMatrix.length-1); k++) {
                row = distanceMatrix[k];
                for (l = k+1; l < (row.length-1); l++) {
                    if (distanceMatrix[l][l+1] == -1) {
                        distanceMatrix[l+1][l] = distanceMatrix[l][l+1] = 0;
                    }
                }
            }
        }

        perm = _order();

        // put back equivalent rows
        for (k = equiv.length; k-- > 0; ) {
            e = equiv[k];
            l = perm.indexOf(e[0]);
            m = fix_except[e[0]];
            if (m && m[0] == e[0]) {
                l = _fix_exception(perm, l, m[0], m[1], 0);
                m = undefined;
            }
            for (n = 1; n < e.length; n++) {
                perm = _perm_insert(perm, l, e[n]);
                if (m && m[0] == e[n]) {
                    l = _fix_exception(perm, l, m[0], m[1], n);
		    m = undefined;
                }
            }
            
        }
        // // put back equivalent rows
        // //TODO fix index that varies when insertions are done in the perm
        // for (k = equiv.length; k-- > 0; ) {
        //     e = equiv[k];
        //     l = perm.indexOf(e[0]);
        // }
        return perm;
    }

    function _fix_exception(perm, l, m, next, len) {
        var i, j, k;

        // for (k = 0; k < except.length; k += 2) {
        //     if (m == except[k]) {
        //         next = m+1;
        //         break;
        //     }
        //     else if (m == except[k]+1) {
        //         next = m-1;
        //         break;
        //     }
        // }
        // if (next == 0) {
        //     throw "Exception not found";
        //     return;
        // }

        if (l > 0 && perm[l-1] == next) {
            _swap(perm, l, perm.indexOf(m));
            return l+1;
        }
        else if (perm[l+len+1] == next) {
            _swap(perm, l+len, perm.indexOf(m));
            return l;
        }
        else
            throw "Index not found";
    }

    function _swap(perm, a, b) {
        if (a == b) return;
        var c = perm[a];
        perm[a] = perm[b];
        perm[b] = c;
    }

    function _order() {
        if (reorder.debug > 1)
            reorder.printmat(distanceMatrix);
        if (reorder.debug > 2)
            reorder.printmat(vector);

        var perm = ordering()
                .linkage(linkage)
                .distanceMatrix(distanceMatrix)(vector);
        if (reorder.debug)
            console.log("Permutation: "+perm);

        return perm;
    }

    function _perm_insert(perm, i, nv) {
         perm = perm
             .map(function(v) { return (v < nv) ? v : v+1; });
         perm.splice(i, 0, nv);
         return perm;
     }

    function _compute_dist() {
        if (distanceMatrix === null)
            distanceMatrix = (reorder.dist().distance(distance))(vector);
        return distanceMatrix;
    }

    order.distance = function(x) {
        if (!arguments.length) return distance;
        distance = x;
        return order;
    };

    order.linkage = function(x) {
        if (!arguments.length) return linkage;
        linkage = x;
        return order;
    };


    order.limits = function(x, y) {
        if (!arguments.length) return [i, j];
        i = x;
        j = y;
        return order;
    };

    order.except = function(list) {
        if (!arguments.length) return except.slice(0);
        except = list.sort(function(a,b) {
            if (a >= b)
                throw "Invalid list, indices not sorted";
            return a-b;
        });
        return order;
    };

    function _orderExcept(vector, i, j) {
        var distanceMatrix = (reorder.dist().distance(distance))(vector);
        var row, k, l, rev = false, args, pos = -1;

        // Set a null distance to stick i/i+1 together
        // TODO: check if no other pair is also ==0
        distanceMatrix[i][i+1] = 0;
        distanceMatrix[i+1][i] = 0;
        var perm = ordering().distanceMatrix(distanceMatrix)(vector);
        pos = perm.indexOf(i);
        for (k = 0; k < perm.length; k++) {
            l = perm[k];
            if (l > i)
                perm[k] += j-i-2;
        }
        if (pos !== 0 && perm[pos-1] === (j-1))
            rev = true;
        if (rev) {
            perm.reverse();
            pos = perm.length-pos-1;
        }
        args = [pos+1, 0].concat(reorder.range(i+1,j-1));
        Array.prototype.splice.apply(perm, args);
        return perm;
    }

    order.orderrowsexcept = order.orderexcept;

    return order;
};
reorder.covariance = reorder.dot;

reorder.covariancetranspose = function(v, a, b) {
    var n = v.length,
	cov = 0,
	i;
    for (i = 0; i < n; i++) {
	cov += v[i][a]*v[i][b];
    }
    return cov;
};

reorder.variancecovariance = function(v) {
    var o = v[0].length,
	cov = Array(o),
	i, j;

    for (i = 0; i < o; i++) {
	cov[i] = Array(o);
    }
    for (i = 0; i < o; i++) {
	for (j = i; j < o; j++)
	    cov[i][j] = cov[j][i] = reorder.covariancetranspose(v, i, j);
    }
    return cov;
};
reorder.laplacian = function(graph, comp) {
    var n = comp.length,
	lap = reorder.zeroes(n, n),
	inv = inverse_permutation(comp),
	i, j, k, row, sum, edges, v, e, other;

    reorder.assert(! graph.directed(), "Laplacian only for undirected graphs");
    for (i = 0; i < n; i++) {
	v = comp[i];
	row = lap[i];
	sum = 0;
	edges = graph.edges(v);
	for (j = 0; j < edges.length; j++) {
	    e = edges[j];
	    other = inv[graph.other(e, v).index];
	    if (other != i) {
		sum += e.value;
		row[other] = -e.value;
	    }
	}
	row[i] = sum;
    }

    return lap;
};
function normalize(v) {
    var norm = reorder.length(v),
	i = v.length;
    if (norm === 0 || Math.abs(norm - 1) < 1e-9) return 1;
    while (i-- > 0)
	v[i] /= norm;
    return norm;
}

reorder.poweriteration = function(v, eps, init) {
    if (! eps) 
	eps = 1e-9;
	
    var n = v.length,
	b,
	i,
	j,
	tmp = Array(n),
	norm,
	s = 100,
	e;

    reorder.assert(n == v[0].length, "poweriteration needs a square matrix");
    if (! init) {
	b = reorder.random_array(n);
    }
    else
	b = init.slice(); // copy
    normalize(b);
    while (s-- > 0) {
	for(i=0; i<n; i++) {
            tmp[i] = 0;
            for (j=0; j<n; j++) tmp[i] += v[i][j] * b[j];
	}
	normalize(tmp);
	if (reorder.dot(tmp, b) > (1.0 - eps))
	    break;
	var t = tmp; tmp = b; b = t; // swap b/tmp
    }
    return tmp;
};

reorder.poweriteration_n = function(v, p, init, eps, start) {
    if (! eps) 
	eps = 1e-9;
	
    var n = v.length,
	b = Array(p), 
	i, j, k, l,
	bk, dot, row,
	tmp = Array(n),
	s = 100,
	eigenvalue = Array(p);

    reorder.assert(n == v[0].length, "poweriteration needs a square matrix");
    if (! init) {
	for (i = 0; i < p; i++) {
	    row = b[i] = reorder.random_array(n);
	    eigenvalue[i] = normalize(row);
	}
    }
    else {
	for (i = 0; i < p; i++) {
	    b[i] = init[i].slice(); // copy
	    eigenvalue[i] = normalize(b[i]);
	}
    }
    if (! start)
	start = 0;
	
    for (k = start; k < p; k++) {
	bk = b[k];
	while (s-- > 0) {
	    // Orthogonalize vector
	    for (l = 0; l < k; l++) {
		row = b[l];
		dot = reorder.dot(bk, row);
		for (i = 0; i < n; i++)
		    bk[i] -= dot*row[i];
	    }
	    
	    for(i=0; i<n; i++) {
		tmp[i] = 0;
		for (j=0; j<n; j++) 
		    tmp[i] += v[i][j] * bk[j];
	    }
	    eigenvalue[k] = normalize(tmp);
	    if (reorder.dot(tmp, bk) > (1 - eps))
	    	break;
	    bk = tmp; tmp = b[k]; b[k] = bk;  // swap b/tmp
	}
	if (reorder.debug)
	    console.log('eig[%d]=%j',k, bk);
    }
    return [b, eigenvalue];
};
// Compute te Fiedler vector, the smallest non-null eigenvector of a matrix.
// See:
// Yehuda Koren, Liran Carmel, David Harel
// ACE: A Fast Multiscale Eigenvector Computation for Drawing Huge Graphs
// Extended version, available at:
// http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.19.7702&rep=rep1&type=pdf
// Transform the matrix B to reverse the order of the eigenvectors.
// B' = g . (I - B) where g is the Gershgorin bound, an upper bound
// for (the absolute value of) the largest eigenvalue of a matrix.
// Also, the smallest eigenvector is 1^n 

function gershgorin_bound(B) {
    var i, j, max = 0, n = B.length, 
	t, row;
    for (i = 0; i < n; i++) {
	row = B[i];
	t = row[i];
	for (j = 0; j < n; j++)
	    if (j != i)
		t += Math.abs(row[j]);
	if (t > max)
	    max = t;
    }
    if (reorder.debug) {
	console.log('gershgorin_bound=%d', max);
    }
    return max;
}

function fiedler_vector(B, eps) {
    var g = gershgorin_bound(B),
	n = B.length,
	// Copy B
	Bhat = B.map(function(row) { return row.slice(); }),
	i, j, row;
    for (i = 0; i < n; i++) {
	row = Bhat[i];
	for (j = 0; j < n; j++) {
	    if (i == j)
		row[j] = g - row[j];
	    else
		row[j] = - row[j];
	}
    }
    var init = [ reorder.array1d(n, 1), reorder.random_array(n) ],
	eig = reorder.poweriteration_n(Bhat, 2, init, eps, 1);
    return eig[0][1];
}

reorder.fiedler_vector = fiedler_vector;
function spectral_order(graph, comps) {
    var i, vec, comp, perm, order = [];
    if (! comps)
	comps = graph.components();

    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	vec = reorder.fiedler_vector(reorder.laplacian(graph, comp));
	perm = reorder.sort_order(vec);
	order = order.concat(reorder.permute(comp, perm));
    }
    return order;
}

reorder.spectral_order = spectral_order;
// Takes a matrix, substract the mean of each row
// so that the mean is 0
function center(v) {
    var n = v.length;

    if (n === 0) return null;
    
    var mean = reorder.meancolumns(v),
	o = mean.length,
	v1 = Array(n),
	i, j, row;

    for (i = 0; i < n; i++) {
	row = v[i].slice(0);
	for (j = 0; j < o; j++) {
	    row[j] -= mean[j];
	}
	v1[i] = row;
    }
    return v1;
}


// See http://en.wikipedia.org/wiki/Power_iteration
reorder.pca1d = function(v, eps) {
    var n = v.length;

    if (v.length === 0) return null;

    v = center(v);
    var cov = reorder.variancecovariance(v);
    return reorder.poweriteration(cov, eps);
};

reorder.pca_order = function(v, eps) {
    return reorder.sort_order(pca1d(v, eps));
};
//Corresponence Analysis
// see http://en.wikipedia.org/wiki/Correspondence_analysis

function sumrows(v) {
    var n = v.length,
	o = v[0].length,
	sumrow = Array(n),
	i, j, row, s;

    for (i = 0; i < n; i++) {
	row = v[i];
	s = 0;
	for (j = 0; j < o; j++) 
	    s += row[j];
	sumrow[i] = s;
    }
    return sumrow;
}

function sumcols(v) {
    var n = v.length,
	o = v[0].length,
	sumcol = reorder.zeroes(o),
	i, j, row;

    for (i = 0; i < n; i++) {
	row = v[i];
	for (j = 0; j < o; j++)
	    sumcol[j] += row[j];
    }
    return sumcol;
}

// Implementation of the decorana fortran code
// See Hill, M. O. 1979. DECORANA - A FORTRAN program for detrended
// correspondence analysis an reciprocal averaging. Cornell University,
// Ithaca, New York. 
// And
// Hill, M. O. 1973. Reciprocal averaging: an eigenvector method of
// ordination. J. Ecol. 61:237-49
// The Fortan implementation is available in the "vegan" R package:
// https://cran.r-project.org/web/packages/vegan/index.html

function decorana(dat) {
    var ZEROEIG = 1e-7, // consider as zero eigenvalue
	x, y, aidot, adotj, mi, n, s1,
	nr = dat.length,
	nc = dat[0].length;
    
    adotj = sumcols(dat);
    aidot = sumrows(dat);
    //console.log('adotj='); reorder.printvec(adotj);
    //console.log('aidot='); reorder.printvec(aidot);

    s1 = eigy(reorder.array1d(nr, 1.0),
	      reorder.array1d(nc, 1.0),
	      nr, nc, dat, aidot, adotj);
    if (s1.eig < ZEROEIG) {
        s1.rows = s1.cols = [];
	s1.eig = 0;
    }
    else {
	x = s1.rows;
	y = s1.cols;
	yxmult(y, x, nr, nc, dat);
	for (var i = 0; i < nr; i++)
	    x[i] /= aidot[i];
    }
    return s1;
}

function trans(y, yy, x, aidot, mi, n, dat,prt) {
    var i, j, a1;
    if (prt) console.log('TRANS '+prt);
    yxmult(y,x,mi,n,dat,prt);
    for (i = 0; i < mi; i++) {
	x[i] = x[i]/aidot[i]; // 10
    }
    // 100
    // a1 = 0.0;
    // for (i = 0; i < mi; i++) 
    // 	a1 += aidot[i]*x[i]; // 110
    // for (i = 0; i < mi; i++)
    // 	x[i] -= a1; // 120
    // 200
    xymult(x,yy,mi,n, dat,prt);
}

function printvec(y) {
    console.log('');
    for (var i = 0; i < y.length; i++) {
	console.log('i:'+(i+1)+' v:  '+y[i].toFixed(5));
    }
}

function xymult(x, y, mi, n, dat, prt) {
    var i, j, ax, row;

    if (prt) {
	console.log('xymult');
	printvec(y,5, null, 'y=');
    }
    for (j = 0; j < n; j++)
	y[j] = 0.0; // 10
    for (i = 0; i < mi; i++) {
	ax = x[i];
	row = dat[i];
	for (j = 0; j < n; j++) 
	    y[j] += ax*row[j]; // 20
    }
    if (prt) {
	//console.log('xymult[1]=');
	printvec(y,5, null, 'y=');
    }
}

function yxmult(y,x,mi,n,dat,prt) {
    var i, j, ax, row;
    if (prt) {
	console.log('yxmult');
	printvec(x,5, null, 'x=');
    }
    for (i = 0; i < mi; i++) {
	ax = 0.0;
	row = dat[i];
	for (j = 0; j < n; j++) {
	    ax += y[j]*row[j]; // 10
	}
	x[i] = ax; // 20
    }
    if (prt) {
	//console.log('yxmult[1]='); 
	printvec(x,5, null, 'x=');
    }
}

function eigy(x, y, mi, n, dat, aidot, adotj) {
    var i, j, tot, icount, a, ay, ex,
	a11, a12, a22, a23, a33, a34, a44, 
	res, ax1, ax2, ax3, ax4,
	b13, b14, b24, row,
	y2 = reorder.zeroes(n),
	y3 = reorder.zeroes(n),
	y4 = reorder.zeroes(n),
	y5 = reorder.zeroes(n),
	tol;

    tot = 0.0;
    for (j = 0; j < n; j++) {
	tot += adotj[j];
	y[j] = j+1.0; // 10
    }
    y[0] = 1.1;
    tol=0.000005;
    trans(y,y,x,aidot,mi,n,dat);//,1);
    icount = 0;
    while(true) {
	// 20
	a = 0.0;
	for (j = 0; j < n; j++)
	    a += y[j]*adotj[j]; // 30
	a /= tot;
	ex = 0.0;
	for (j = 0; j < n; j++) {
	    ay = y[j]-a;
	    ex += ay*ay*adotj[j];
	    y[j] = ay; // 40
	}
	ex = Math.sqrt(ex);
	for (j = 0; j < n; j++)
	    y[j] /= ex; // 50
	trans(y,y2,x,aidot,mi,n,dat);//,2);
	a=0.0;
	a11=0.0;
	a12=0.0;
	a22=0.0;
	a23=0.0;
	a33=0.0;
	a34=0.0;
	a44=0.0;
	for (j = 0; j < n; j++) {
	    ay = y2[j];
	    y2[j] = ay/adotj[j];
	    a += ay;
	    a11 += ay*y[j]; // 60
	}
	a /= tot;
	for (j = 0; j < n; j++) {
	    ay = y2[j]-(a+a11*y[j]);
	    a12 += ay*ay*adotj[j];
	    y2[j] = ay; // 70
	}
	a12 = Math.sqrt(a12);
	for (j = 0; j < n; j++)
	    y2[j] /= a12; // 80
	if (a12 < tol || icount > 999)
	    break;
	icount++;
	trans(y2,y3,x,aidot,mi,n,dat);//,3);
	a = 0.0;
	b13 = 0.0;
	for (j = 0; j < n; j++) {
	    ay = y3[j];
	    y3[j] = ay/adotj[j];
	    a += ay;
	    a22 +=ay*y2[j];
	    b13 += ay*y[j]; // 90
	}
	a /= tot;
	for (j = 0; j < n; j++) {
	    ay = y3[j]-(a+a22*y2[j]+b13*y[j]);
	    a23 += ay*ay*adotj[j];
	    y3[j]=ay; // 100
	}
	a23=Math.sqrt(a23);
	if (a23 > tol) {
	    // 105
	    for (j = 0; j < n; j++) {
		y3[j] /= a23; // 110
	    }
	    trans(y3,y4,x,aidot,mi,n,dat);//,4);
	    a = 0.0;
	    b14 = 0.0,
	    b24 = 0.0;
	    for (j = 0; j < n; j++) {
		ay = y4[j];
		y4[j] /= adotj[j];
		a += ay;
		a33 += ay*y3[j];
		b14 += ay*y[j];
		b24 += ay*y2[j]; // 120
	    }
	    a /= tot;
	    for (j = 0; j < n; j++) {
		ay = y4[j]-(a+a33*y3[j]+b14*y[j]+b24*y2[j]);
		a34 += ay*ay*adotj[j];
		y4[j] = ay; // 130
	    }
	    a34=Math.sqrt(a34);
	    if(a34 > tol) {
		// 135
		for (j = 0; j < n; j++)
		    y4[j] /= a34; // 140
		trans(y4,y5,x,aidot,mi,n,dat);//,5);
		for (j = 0; j < n; j++)
		    a44 += y4[j]*y5[j]; // 150
	    }
	    else {
		a34=0.0;
	    }
	}
	else {
	    a23 = 0.0;
	}
	// 160
	res = solve_tridiag(tol, a11, a12, a22, a23, a33, a34, a44);
	ax1 = res[0]; ax2 = res[1]; ax3 = res[2]; ax4 =res[3];
	// console.log('i '+icount+
	// 	    ' ax1 '+ax1.toFixed(6)+
	// 	    ' ax2 '+ax2.toFixed(6)+
	// 	    ' ax3 '+ax3.toFixed(6)+
	// 	    ' ax4 '+ax4.toFixed(6));

	// 180
	if(a12 < tol) break;
	for (j = 0; j < n; j++)
	    y[j]= ax1*y[j]+ax2*y2[j]+ax3*y3[j]+ax4*y4[j]; // 190
	// goto 20
    }
    // 200
    //console.log('eigenvalue',a11.toFixed(6));
    if (a12 > tol && reorder.debug > 0) {
	console.log("residual bigger than tolerance on axis 1");
    }
    var aymax = y[0],
	aymin = y[0],
	sign = 1;
    for (j = 1; j < n; j++) {
	a = y[j];
	if (a < aymin)
	    aymin = a;
	else if (a > aymax)
	    aymax = a;
    }
    if (-aymin > aymax) {
	for (j = 0; j < n; j++) // 210
	    y[j] = -y[j];
    }
    yxmult(y,x,mi,n,dat);//,true);
    for (i = 0; i < mi; i++)
	x[i] /= aidot[i]; // 220
    // 225
    var axlong = 0.0;
    for (i = 0; i < mi; i++)
	axlong += aidot[i]*sqr(x[i]); // 230
    axlong = Math.sqrt(axlong);
    for (i = 0; i < mi; i++)
	x[i] /= axlong; // 240
    for (j = 0; j < n; j++)
	y[j] /= axlong; // 250
    var sumsq=0.0,
	ax;
    for (i = 0; i < mi; i++) {
	ax = x[i];
	row = dat[i];
	for (j = 0; j < n; j++) {
	    sumsq += row[j]*sqr(ax-y[j]); // 255
	}
	// 260
    }
    var sd = Math.sqrt(sumsq/tot);
    if (a11 >= 0.999) {
	sd = aymax/axlong;
	var sd1 = -aymin/axlong;
	if (sd1 > sd)
	    sd = sd1;
    }
    // 265
    for (j = 0; j < n; j++)
	y[j] /= sd; // 270
    
    //printvec(x);
    //printvec(y);
    return {rows: x, cols: y, eig: a11};
}

function sqr(x) { return x*x; }

function solve_tridiag(tol, a11, a12, a22, a23, a33, a34, a44) {
    var ax1=1.0, // 160
	ax2=0.1,
	ax3=0.01,
	ax4=0.001,
	itimes,
	axx1, axx2, axx3, axx4, ex, exx, resi;
    //console.log('a11:'+a11+' a12:'+a12+' a22:'+a22);
    //console.log('a23:'+a23+' a33:'+a33+' a34:'+a34+' a44:'+a44);
    for (itimes = 0; itimes < 100; itimes++) {
	axx1=a11*ax1+a12*ax2;
	axx2=a12*ax1+a22*ax2+a23*ax3;
	axx3=a23*ax2+a33*ax3+a34*ax4;
	axx4=a34*ax3+a44*ax4;
	ax1=a11*axx1+a12*axx2;
	ax2=a12*axx1+a22*axx2+a23*axx3;
	ax3=a23*axx2+a33*axx3+a34*axx4;
	ax4=a34*axx3+a44*axx4;
	ex=Math.sqrt(sqr(ax1)+sqr(ax2)+sqr(ax3)+sqr(ax4));
	ax1=ax1/ex;
	ax2=ax2/ex;
	ax3=ax3/ex;
	ax4=ax4/ex;
	if((itimes+1)%5 == 0) {
	    exx=Math.sqrt(ex);
	    resi=Math.sqrt(sqr(ax1-axx1/exx)+sqr(ax2-axx2/exx)+
			   sqr(ax3-axx3/exx)+sqr(ax4-axx4/exx));
	}
	if (resi < tol*0.05)
	    break;
	// 170
    }
    // 180
    return [ax1, ax2, ax3, ax4];
}

reorder.ca_decorana = decorana;
reorder.ca = decorana;

reorder.ca_order = function(dat) {
    var res = reorder.ca(dat);
    return { rows: reorder.sort_order(res.rows),
	     cols: reorder.sort_order(res.cols),
	     details: res };
};

/*jshint loopfunc:true */
reorder.cuthill_mckee = function(graph, comp) {
    if (comp.length < 3)
	return comp;

    var nodes = graph.nodes(),
	start = comp[0], 
	min_deg = graph.degree(start),
	i, n, edges, e,
	visited = {},
	queue = new Queue(),
	inv = inverse_permutation(comp),
	perm = [];

    for (i = 0; i < comp.length; i++) {
	n = comp[i];
	if (graph.degree(n) < min_deg) {
	    min_deg = graph.degree(n);
	    start = n;
	    if (min_deg == 1)
		break;
	}
    }
    queue.push(start);
    while (queue.length !== 0) {
	n = queue.shift();
	if (visited[n])
	    continue;
	visited[n] = true;
	perm.push(n);
	e = graph.edges(n)
	    .map(function(edge) { return graph.other(edge, n).index; })
	    .filter(function(n) { return !visited[n] && (n in inv); })
	    .sort(function(a, b) { // ascending by degree
		return graph.degree(a) - graph.degree(b);
	    });

	e.forEach(queue.push, queue);
    }
    return perm;
};

reorder.reverse_cuthill_mckee = function(graph, comp) {
    return reorder.cuthill_mckee(graph, comp).reverse();
};


reorder.cuthill_mckee_order = function(graph, comps) {
    var i, comp, order = [];
    if (! comps) {
	comps = graph.components();
    }
    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	order = order.concat(
	    reorder.cuthill_mckee(graph, comp));
    }
    return order;
};

reorder.reverse_cuthill_mckee_order = function(graph, comps) {
    var i, comp, order = [];
    if (! comps) {
	comps = graph.components();
    }
    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	order = order.concat(
	    reorder.reverse_cuthill_mckee(graph, comp));
    }
    return order;
};

reorder.condition = function(matrix) {
    var i, j, min, max, v, s, row,
	ret = [];

    for (i = 0; 0 < matrix.length; i++) {
	row = matrix[i].slice();
	row.push(ret);
	for (j = 0; j < ret.length; j++) {
	    v = row[j];
	    if (v !== null && b >= b) {
		min = max = row[j];
		break;
	    }
	}
	for (; j < ret.length; j++) {
	    v = row[j];
	    if (v < min) min = v;
	    else if (v > max) max = v;
	}
	s = max != min ? 1.0 / (max - min) : 0;
	for (j = 1; j < ret.length; j++) {
	    v = row[j];
	    if (v != null && v >= v)
		row[j] = row[j]*s - min;
	    else
		v = NaN;
	}

    }
    return ret;
};
function array_to_dicts(data, axes) {
    if (arguments.length < 2) 
	axes = reorder.range(data[0].length);
    var ret = [], row, dict, i, j;
    for (i = 0; i < data.length; i++) {
	row = data[i];
	dict = {};
	for (j = 0; j < row.length; j++) {
	    dict[axes[j]] = row[j];
	}
	ret.push(dict);
    }
    return ret;
}

reorder.array_to_dicts = array_to_dicts;

function dicts_to_array(dicts, keys) {
    if (arguments.length < 2)
	keys = Object.keys(dicts[0]);
    var n = keys.length,
	m = dicts.length,
	array = Array(m), i, j, row;

    for (i = 0; i < m; i++) {
	row = Array(n);
	array[i] = row;
	for (j = 0; j < n; j++)
	    row[j] = dicts[i][keys[j]];
    }
    return array;
}

reorder.dicts_to_array = dicts_to_array;

function abs_matrix(x) {
    return x.map(function(y) { return y.map(Math.abs); });
}

function pcp_flip_axes(perm, naxes, pcor) {
    var i, c, sign = 1, signs = [1], negs=0;
    for (i = 1; i < perm.length; i++) {
	c = pcor[perm[i-1]][perm[i]];
	if (c < 0)
	    sign = -sign;
	if (sign < 0) {
	    signs.push(-1);
	    negs++;
	}
	else
	    signs.push(1);
    }
    if (reorder.debug)
	console.log(signs);
    sign = (negs > (perm.length-negs)) ? -1 : 1;
    if (sign==-1) {
	for (i = 0; i < (perm.length-1); i++)
	    signs[i] = signs[i]*sign;
    }
    return signs;
}

function pcp(data, axes) {
    if (! axes)
	axes = reorder.range(data[0].length);
    
    var tdata = reorder.transpose(data),
	pcor = reorder.correlation.pearsonMatrix(tdata),
	abs_pcor = abs_matrix(pcor),
	h1 = science.stats.hcluster()
	    .linkage("complete")
	    .distanceMatrix(abs_pcor)(tdata),
	perm = reorder.optimal_leaf_order()
	    .distanceMatrix(abs_pcor)(tdata),
	naxes = reorder.permute(axes, perm);
    tdata = reorder.permute(tdata, perm);

    
    var signs = pcp_flip_axes(perm, naxes, pcor),
	ndata = reorder.transpose(tdata);
    return [ndata, perm, naxes, signs, pcor];
}

reorder.pcp = pcp;

function parcoords(p) {
    p.detectDimensions()
	.autoscale();

    var data = p.data(),
	types = p.types(),
	dimensions = p.dimensions(),
	tdata = [], row, discarded = [],
	i, j, k, d;

    for (i = 0; i < dimensions.length; i++) {
	d = dimensions[i];
	if (types[d] == 'number') {
	    row = [];
	    for (j = 0; j < data.length; j++)
		row.push(data[j][d]);
	    tdata.push(row);
	}
	else if (types[d] == 'date') {
	    row = [];
	    for (j = 0; j < data.length; j++)
		row.push(data[j][d].getTime()*0.001);
	    tdata.push(row);
	}
	else {
	    // remove dimension
	    dimensions.splice(i, 1);
	    discarded.push(d);
	    i--;
	}
    }
    var pcor = reorder.correlation.pearsonMatrix(tdata),
	abs_pcor = abs_matrix(pcor),
	h1 = science.stats.hcluster()
	    .linkage("complete")
	    .distanceMatrix(abs_pcor)(tdata),
	perm = reorder.optimal_leaf_order()
	    .distanceMatrix(abs_pcor)(tdata),
	naxes = reorder.permute(dimensions, perm);
    tdata = reorder.permute(tdata, perm);
    
    var signs = pcp_flip_axes(perm, naxes, pcor);
    for (i = 0; i < signs.length; i++) {
	if (signs[i] < 0)
	    p.flip(dimensions[i]);
    }
    dimensions = discarded.reverse().concat(dimensions); // put back string columns
    return p.dimensions(dimensions);
}

reorder.parcoords = parcoords;
})(this);
