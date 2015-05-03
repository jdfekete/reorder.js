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
