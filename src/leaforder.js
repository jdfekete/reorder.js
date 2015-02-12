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
        distance = science.stats.distance.euclidean,
        root = null, 
        isLeaf = function(n) { return n.depth == 0; }
    function leaves(n) {
	if (n == null) return [];
	if (isLeaf(n)) return [n.observation];
	return leaves(n.left).concat(leaves(n.right));
    }
    
    function order(v, i, j) {
	if (isLeaf(v))
	    return [0, [v]];
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
	var Wl = leaver(w.left), Wr = leaves(w.right);
	var Ks = Wr.indexOf(i) != -1 ? Wl : Wr;
	if (Ks.length == 0) 
	    Ks = [i];

	var Xl = leaves(x.left), Xr = leaves(x.right);
	var Ls = Xr.indexOf(j) != -1 ? Xl : Xr;
	if (Ls.length == 0)
	    Ls = [j];

	var maximum = Infinity, optimal_order = [];

	for (var k in Ks) {
	    var w_max = order(w, i, k);
	    for (var l in Ls) {
		var x_max = order(x, l, j);
		var sim = w_max[0] + distanceMatrix[k][l] + x_max[0];
		if (sim < max) {
		    max = sim;
		    optimal_order = w_max.order.concat(x_max.order);
		}
	    }
	}
	return [max, optimal_order];
    }

    function order(v) {
	var max = Infinity,
	    optimal_order = [],
	    left = leaves(v.left),
	    right = leaves(v.right);
	
	for (var i in left) {
	    for (var j in right) {
		var so = order(v, i. j);
		if (so[0] < max) {
		    max = so[0];
		    optimal_order = so[1];
		}
	    }
	}
	return optimal_order;
    }

    leafOrder.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	return leafOrder;
    };

    function leafOrder(vector) {
	var hcluster = science.stats.hcluster().distance(distance);
	distanceMatrix = (reorder.dist().distance(distance))(vector);
	return order(hcluster(vector));
    }

    return leafOrder;
};


