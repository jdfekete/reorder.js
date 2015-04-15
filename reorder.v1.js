(function(exports){
reorder = {version: "0.0.2"}; // semver

reorder.dot = science.lin.dot;
reorder.length = science.lin.length;
reorder.normalize = science.lin.normalize;

reorder.printmat = function(m) {
    var i, j, row, line;
    for (i = 0; i < m.length; i++) {
	row = m[i];
	line = "";
	for (j = 0; j < row.length; j++) {
	    if (line.length != 0)
		line += ", ";
	    line += row[j].toFixed(4);
	}
	console.log(i.toPrecision(3)+": "+line);
    }
};

reorder.assert = function(v, msg) {
    if (! v) {
	console.log(msg);
	throw msg || "Assertion failed";
    }
};

reorder.printhcluster = function(cluster,indent) {
    if (cluster.left == null) 
	return  Array(indent+1).join(' ')+"id: "+cluster.id;

    return Array(indent+1).join(' ')
	+"id: "+cluster.id+", dist: "+cluster.dist+"\n"
	+reorder.printhcluster(cluster.left, indent+1)+"\n"
	+reorder.printhcluster(cluster.right, indent+1);
};
reorder.mean = science.stats.mean;

reorder.meantranspose = function(v, j) {
    var n = v.length;
    if (n == 0) return NaN;
    var o = v[0].length,
	m = 0,
	i = -1,
	row;

    while(++i < n) m += (v[i][j] - m) / (i+1);

    return m;
};

reorder.meancolumns = function(v) {
    var n = v.length;
    if (n == 0) return NaN;
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

reorder.sum = function(v) {
    var i = v.length,
	s = v[0];
    while(i-- > 1)
	s += v[i];
    return s;
}
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
	if (n == 0) return 0;
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
	if (s1 == 0) return 0;
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
	    n = matrix.length, ret, mx, sx, sx2;
	if (n === 0)
	    return NaN;
	mx = Array(n);
	sx = science.zeroes(n);
	sx2 = science.zeroes(n);
	for (i = 0; i < n; i++) {
	    mx[i] = science.stats.mean(matrix[i]);
	}
	for (i = 0; i < n; i++) {
	    a = matrix[i];
	    ma = mx[i];
	    for (j = 0; j < n; j++) {
		dx = (a[j] - ma);
		sx[j] += dx;
		sx2[j] += dx*dx;
	    }
	}
	ret = Array(n);
	for (i = 0; i < n; i++) {
	    ret[i] = Array(n);
	    for (j = 0; j < n; j++) {
		ret[i][j] = sx[i]*sx[j]/Math.sqrt(sx2[i]*sx2[j]);
	    }
	}
	return ret;
    }
};

reorder.heap = function(comp) {
    var heap = [], index = {}, Heap = {};

    Heap.length = function() { return heap.length; }
    Heap.insert = function(o) {
	var i = heap.length;
	heap.push(null);
	percolateUp(i, o);
    };

    Heap.isEmpty = function() { return heap.length == 0; };
    Heap.peek = function() {
	if (heap.length == 0)
	    throw {error: "Empty heap"};
	return heap[0];
    };

    Heap.pop = function() {
	if (heap.length == 0)
	    throw {error: "Empty heap"};
	var top = heap[0];
	if (top == null)
	    return top;

	var boto = heap[heap.length-1];
	heap[0] = boto;
	index[boto] = 0;

	heap.pop();
	if (heap.length > 1)
	    percolateDown(0);

	delete index[top];
	return top;
    };

    function lChild(i) { return i*2 + 1; };
    function rChild(i) { return i*2 + 2; };
    function parent(i) { return Math.floor((i-1)/2); };
    function swap(i, j) {
	var io = heap[i], jo = heap[j];
	heap[i] = jo;
	index[jo] = i;
	heap[j] = io;
	index[io] = j;
    };

    function update(o) {
	var i = percolateUp(index[o], o);
	percolateDown(i);
    };

    function percolateDown(cur) {
	while (true) {
	    var left = lChild(cur), right = rChild(cur);
	    var smallest;
	    if ((left < heap.length) && (comp(heap[left], heap[cur]) < 0))
		smallest = left;
	    else
		smallest = cur;

	    if ((right < heap.length) && (comp(heap[right], heap[smallest])) < 0)
		smallest = right;

	    if (cur == smallest) 
		return;
	    swap(cur, smallest);
	    cur = smallest;
	}
    };

    function percolateUp(cur, o) {
	var i = cur;

	for (par = parent(i);
	     (i > 0) && (comp(heap[par], o) > 0);
	     par = parent(par)) {
	    var p = heap[par];
	    heap[i] = p;
	    index[p] = i;
	    i = par;
	}
	heap[i] = o;
	index[o] = i;

	return i;
    };

    return Heap;
};
reorder.permutation = reorder.range;


reorder.graph = function(nodes, links) {
    var graph = {},
        linkDistance = 1,
        edges,
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
	    o = links[i];
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
	    if (ccomp.length)
		comps.push(ccomp);
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
reorder.mat2graph = function(mat, directed) {
    var n = mat.length,
	nodes = [],
	links = [],
	i, j, v, m;
    
    for (i = 0; i < n; i++) {
	v = mat[i];
	nodes.push({id: i});
	m = directed ? n : i+1;
	m = Math.min(m, v.length);
	for (j = 0; j < m; j++) {
	    if (v[j] != 0) {
		links.push({source: i, target: j, value: v[j]});
	    }
	}
    }
    return reorder.graph()
	.nodes(nodes)
	.links(links)
	.init();
};
reorder.graph2mat = function(graph, directed) {
    var nodes = graph.nodes(),
	links = graph.links(),
	n = nodes.length,
	i, l, mat;

    mat = Array(n);
    for (i = 0; i < n; i++) {
	mat[i] = science.zeroes(n);
    }
    for (i = 0; i < links.length; i++) {
	l = links[i];
	mat[l.source.index][l.target.index] = l.value ? l.value : 1;
	if (! directed)
	    mat[l.target.index][l.source.index] = l.value ? l.value : 1;
    }
    return mat;
};
reorder.dijkstra = function(graph) {
    var g = graph, dijkstra = {};

    function allShortestPaths(from, queued) {
	var preds = {}, edges, v, v2, e, d, D,
	    queue = reorder.heap(function(i, j) {
		return preds[i].weight - preds[j].weight;
	    }),
	    p = { edge: -1, vertex: from, weight: 0 }, p2;
	if (! queued) 
	    queued = {};
	queued[from] = p;
	queue.insert(from);

	while (! queue.isEmpty()) {
	    p = queued[queue.pop()];
	    v = p.vertex;
//	    delete queued[v];
	    edges = graph.edges(v);
	    for (var i = 0; i < edges.length; i++) {
		e = edges[i].index;
		d = p.weight + graph.distance(e);
		v2 = graph.other(e, v).index;
		D = queued[v2];
		if (! D) {
		    p2 = {edge: e, vertex: v2, weight: d};
		    queue.insert(v2);
		    queued[v2] = p2;
		}
		else if (D.weight > d) {
		    D.weight = d;
		    D.edge = e;
		    queue.update(D.vertex);
		}
	    }
	}
	return queued;
    }

    dijkstra.shortestPath = function(from, to) {
	var map = allShortestPaths(from), path, v;
	v = map[to];
	path = [ v ];
	while (v.edge != -1) {
	    v = map[graph.other(v.edge, v.vertex).index];
	    path.unshift(v);
	}
	return path;
    }

    return dijkstra;
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
    };

    dist.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	return dist;
    };

    return dist;
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

reorder.randomMatrix = function(n, p) {
    var mat = science.zeroes(10, 10), i, j;

    for (i = 0; i < 10; i++) {
	for (j = 0; j < i+1; j++) {
	    if (Math.random() < p) {
		mat[i][j] = mat[j][i] = 1;
	    }
	}
    }
    return mat;
}
reorder.permute = function(list, indexes) {
    var m = indexes.length;
    var copy = list.slice(0);
    while (m--)
	copy[m] = list[indexes[m]];
    return copy;
};

reorder.permutetranspose = function(array, indexes) {
    var m = array.length;
    while (m-- > 0)
	array[m] = reorder.permute(array[m], indexes);
    return array;
};

reorder.stablepermute = function(list, indexes) {
    var p = reorder.permute(list, indexes);
    if (p[0] > p[p.length-1]) 
	p.reverse();
    return p;
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
      if (distMatrix == null) {
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

      // infinity ­out old row c2 and column c2
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

reorder.leafOrder = function() {
    var distanceMatrix = null,
        distance = reorder.distance.euclidean,
	linkage = "complete",
	debug = 0,
        leavesMap = {},
        orderMap = {};

    function isLeaf(n) {
	return n.depth == 0;
    }

    function leaves(n) {
	if (n == null) return [];
	if (n.id in leavesMap)
	    return leavesMap[n.id];
	return (leavesMap[n.id] = _leaves(n));
    }

    function _leaves(n) {
	if (n == null) return [];
	if (n.depth == 0) return [n.id];
	return leaves(n.left).concat(leaves(n.right));
    }

    function order(v, i, j) {
	var key = "k"+v.id + "-"+i+"-"+j; // ugly key
	if (key in orderMap) 
	    return orderMap[key];
	return (orderMap[key] = _order(v, i, j));
    }
    
    function _order(v, i, j) {
	if (v.depth == 0) //isLeaf(v))
	    return [0, [v.id]];
	var l = v.left, r = v.right;
	var L = leaves(l), R = leaves(r);
	
	var w, x;
	if (L.indexOf(i) != -1 && R.indexOf(j) != -1) {
	    w = l; x = r;	    
	}
	else if (R.indexOf(i) != -1 && L.indexOf(j) != -1) {
	    w = r; x = l;
	}
	else 
	    throw {error: "Node is not common ancestor of "+i+", "+j};
	var Wl = leaves(w.left), Wr = leaves(w.right);
	var Ks = Wr.indexOf(i) != -1 ? Wl : Wr;
	if (Ks.length == 0) 
	    Ks = [i];

	var Xl = leaves(x.left), Xr = leaves(x.right);
	var Ls = Xr.indexOf(j) != -1 ? Xl : Xr;
	if (Ls.length == 0)
	    Ls = [j];

	var max = Infinity, optimal_order = [];

	for (var k = 0; k < Ks.length; k++) {
	    var w_max = order(w, i, Ks[k]);
	    for (var m = 0; m < Ls.length; m++) {
		var x_max = order(x, Ls[m], j);
		var sim = w_max[0] + distanceMatrix[Ks[k]][Ls[m]] + x_max[0];
		if (sim < max) {
		    max = sim;
		    optimal_order = w_max[1].concat(x_max[1]);
		}
	    }
	}
	return [max, optimal_order];
    }

    function orderFull(v) {
        leavesMap = {};
        orderMap = {};
	var max = Infinity,
	    optimal_order = [],
	    left = leaves(v.left),
	    right = leaves(v.right);
	
	if (debug)
	    console.log(reorder.printhcluster(v,0));

	for (var i = 0; i < left.length; i++) {
	    for (var j = 0; j < right.length; j++) {
		var so = order(v, left[i], right[j]);
		if (so[0] < max) {
		    max = so[0];
		    optimal_order = so[1];
		}
	    }
	}
	distanceMatrix = null;
	return optimal_order;
    }

    function leafOrder(vector) {
	if (distanceMatrix == null)
	    distanceMatrix = (reorder.dist().distance(distance))(vector);
	var hcluster = science.stats.hcluster()
		.linkage(linkage)
		.distanceMatrix(distanceMatrix);
	return orderFull(hcluster(vector));
    }

    leafOrder.debug = function(x) {
	if (!arguments.length) return debug;
	debug = x;
	return leafOrder;
    };

    leafOrder.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	distanceMatrix = null;
	return leafOrder;
    };

    leafOrder.linkage = function(x) {
	if (!arguments.length) return linkage;
	linkage = x;
	return leafOrder;
    };

    leafOrder.distanceMatrix = function(x) {
	if (!arguments.length) return distanceMatrix;
	// copy
	distanceMatrix = x.map(function(y) { return y.slice(0); });
	return leafOrder;
    };

    leafOrder.orderFull = orderFull;


    return leafOrder;
};



reorder.order = function() {
    var distance = reorder.distance.euclidean,
        ordering = reorder.leafOrder,
        linkage = "complete",
        distanceMatrix,
        vector,
        except = [],
        debug = 0,
        i = 0, j = Infinity;


    function _reset() {
        distance = reorder.distance.euclidean;
        ordering = reorder.leafOrder;
        linkage = "complete";
        distanceMatrix = null;
        vector = null;
        except = [];
        debug = 0;
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
        if (i == 0 && j == vector.length)
            return _order_except();

        if (debug)
            console.log("i0="+i0+" j0="+j0);

        if (distanceMatrix != null) {
            if (j0 != vector.length)
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
            if (i0 != 0) {
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
            if (perm[0] != 0)
                perm.reverse();
            if (j0 > j) {
                reorder.assert(perm[0] == 0 && perm[perm.length-1]==perm.length-1,
                       "Invalid constrained permutation endpoints");
            }
            else {
                reorder.assert(perm[0] == 0,
                       "Invalid constrained permutation start");
            }
        }
        else if (j0 > j) {
            if (perm[perm.length-1] != (perm.length-1))
                perm = perm.reverse();
            reorder.assert(perm[perm.length-1] == perm.length-1,
                           "Invalid constrained permutation end");
        }
        if (i0 != 0) {
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

        if (except.length == 0)
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
            if (debug)
                console.log("Except["+low+", "+high+"]");
            if (distanceMatrix[low][low+1] != 0) {
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
            if (j != -1) {
                fix_except[k] = [k,j]; // keep track for later fix
                has_1 = true;
            }
            // top down to keep the indices
            for (l = row.length; --l >  k; ) {
                if (row[l] == 0) {
                    j = distanceMatrix[l].indexOf(-1);
                    if (j != -1) {
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
            if (e.length != 0) {
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
        if (debug > 1)
            reorder.printmat(distanceMatrix);
        if (debug > 2)
            reorder.printmat(vector);

        var perm = ordering()
                .debug(debug)
                .linkage(linkage)
                .distanceMatrix(distanceMatrix)(vector);
        if (debug)
            console.log("Permutation: "+perm);

        return perm;
    }

    function _perm_insert(perm, i, nv) {
         perm = perm
             .map(function(v) { return (v < nv) ? v : v+1; });
         perm.splice(i, 0, nv);
         return perm;
     }

    order.debug = function(x) {
        if (!arguments.length) return debug;
        debug = x;
        return order;
    };

    function _compute_dist() {
        if (distanceMatrix == null)
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
        if (pos != 0 && perm[pos-1] == (j-1))
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
reorder.covariance = science.lin.dot;

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
}
function normalize(v) {
    var norm = science.lin.length(v),
	i = v.length; 
    while (i-- > 0)
	v[i] /= norm;
    return v;
}

reorder.poweriteration = function(v, eps) {
    if (arguments.length < 2) 
	eps = 0.0001;
	
    var n = v.length,
	b = Array(n),
	i,
	j,
	tmp = Array(n),
	norm,
	s = 10;

    reorder.assert(n == v[0].length, "poweriteration needs a square matrix");
    for (i = 0; i < n; i++)
	b[i] = Math.random();
    b = normalize(b);
    while (s-- > 0) {
	for(i=0; i<n; i++) {
            tmp[i] = 0;
            for (j=0; j<n; j++) tmp[i] += v[i][j] * b[j];
	}
	tmp = normalize(tmp);
//	if (science.lin.dot(tmp, b) > (1 - eps))
//	    break;
	var t = tmp; tmp = b; b = t; // swap b/tmp
    }
    return tmp;
};
reorder.sortorder = function(v) {
    return reorder.range(0, v.length).sort(
	function(a,b) { return v[a] - v[b]; });
};
// Takes a matrix, substract the mean of each row
// so that the mean is 0
reorder.center = function(v) {
    var n = v.length;

    if (n == 0) return null;
    
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
};


// See http://en.wikipedia.org/wiki/Power_iteration
reorder.pca1d = function(v, eps) {
    if (arguments.length < 2) 
	eps = 0.0001;

    var n = v.length;

    if (v.length == 0) return null;

    v = reorder.center(v);
    var cov = reorder.variancecovariance(v);
    return reorder.poweriteration(cov, eps);
};

reorder.pca1dorder = function(v, eps) {
    return reorder.sortorder(pca1d(v, eps));
}
//Corresponence Analysis
// see http://en.wikipedia.org/wiki/Correspondence_analysis

reorder.sumlines = function(v) {
    var n = v.length,
	o = v[0].length,
	sumline = Array(n),
	i, j, row, s;

    for (i = 0; i < n; i++) {
	row = v[i];
	s = 0;
	for (j = 0; j < o; j++)
	    s += row[j];
	sumline[i] = s;
    }
    return sumline;
};

reorder.sumcols = function(v) {
    var n = v.length,
	o = v[0].length,
	sumcol = science.zeroes(o),
	i, j, row;

    for (i = 0; i < n; i++) {
	row = v[i];
	for (j = 0; j < o; j++)
	    sumcol[j] += row[j];
    }
    return sumcol;
}

reorder.ca = function(v, eps) {
    if (arguments.length < 2) 
	eps = 0.0001;

    var n = v.length,
	o = v[0].length,
	sumline = reorder.sumlines(v),
	sumcol = reorder.sumcols(v),
	s = reorder.sum(sumcol),
	i, j, row;

    //reorder.printmat(v);
    //console.log("lines: "+sumline);
    //console.log("cols: "+sumcol);
    //console.log("sum: "+s);
    // switch to frequency
    for (i = 0; i < n; i++) {
	v[i] = v[i].map(function(a) { return a / s; });
    }
    sumline = reorder.sumlines(v);
    sumcol = reorder.sumcols(v);

    //reorder.printmat(v);
    //console.log("lines: "+sumline);
    //console.log("cols: "+sumcol);
    
    var v2 = Array(n), ep;

    for (i = 0; i < n; i++) {
	v2[i] = Array(o);
	for (j = 0; j < o; j++) {
	    ep = sumline[i]*sumcol[j];
	    v2[i][j] = (v[i][j] - ep) / Math.sqrt(ep);
	}
    }
    //reorder.printmat(v2);

    for (i = 0; i < n; i++) {
	for (j = 0; j < o; j++) {
	    ep = sumline[i]*sumcol[j];
	    v[i][j] = (v[i][j] - ep) / (sumcol[j]*Math.sqrt(sumline[i]));
	}
    }
    //reorder.printmat(v);

    var cov = Array(n);
    for (i = 0; i < n; i++)
	cov[i] = Array(n);

    for (i = 0; i < n; i++) 
	for (j = i; j < n; j++) 
	    cov[i][j] = cov[j][i] = reorder.covariance(v2[i], v2[j]);
	    
    //console.log("Variance-Covariance");
    //reorder.printmat(cov);

    var eigenvector1 = reorder.poweriteration(cov, eps),
	eigenvalue1 = 0;
    for (i = 0; i < n; i++)
	eigenvalue1 += eigenvector1[i]*cov[i][0];
    eigenvalue1 /= eigenvector1[0];
    //console.log("Eigenvalue1="+eigenvalue1);

    return eigenvector1;
};

})(this);
