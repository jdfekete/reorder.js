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

    function optimal_leaf_order(matrix) {
	if (distanceMatrix === null)
	    distanceMatrix = (reorder.dist().distance(distance))(matrix);
	var hcluster = science.stats.hcluster()
		.linkage(linkage)
		.distanceMatrix(distanceMatrix);
	return orderFull(hcluster(matrix));
    }
    optimal_leaf_order.order = orderFull;
    optimal_leaf_order.reorder = optimal_leaf_order;

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


