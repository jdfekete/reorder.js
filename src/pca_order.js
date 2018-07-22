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
    return reorder.sort_order(reorder.pca1d(v, eps));
};
