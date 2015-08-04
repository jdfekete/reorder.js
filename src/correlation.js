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
