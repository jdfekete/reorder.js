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
