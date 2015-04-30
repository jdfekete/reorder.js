function normalize(v) {
    var norm = science.lin.length(v),
	i = v.length;
    if (norm == 0) return v;
    while (i-- > 0)
	v[i] /= norm;
    return v;
}

reorder.poweriteration = function(v, eps, init) {
    if (! eps) 
	eps = 0.0001;
	
    var n = v.length,
	b,
	i,
	j,
	tmp = Array(n),
	norm,
	s = 10;

    reorder.assert(n == v[0].length, "poweriteration needs a square matrix");
    if (! init) {
	b = Array(n);
	for (i = 0; i < n; i++)
	    b[i] = Math.random();
    }
    else 
	b = init.slice(); // copy
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

reorder.poweriteration_n = function(v, p, init, eps) {
    if (! eps) 
	eps = 0.0001;
	
    var n = v.length,
	b = Array(p), bk,
	i, j, k, l,
	tmp,
	s = 10;

    reorder.assert(n == v[0].length, "poweriteration needs a square matrix");
    if (! init) {
	for (i = 0; i < p; i++) {
	    tmp = b[i] = Array(n);
	    for (j = 0; j < n; j++)
		tmp[j] = Math.random();
	}
    }
    else {
	for (i = 0; i < p; i++)
	    b[i] = init[i].slice(); // copy
    }
    for (k = 0; k < p; j++) {
	bk = b[k] = normalize(b[k]);
	// Orthogonalize vector
	for (l = 0; l < k; l++) {
	    tmp = b[l];
	    var dot = science.dot(bk, tmp);
	    for (i = 0; i < n; i++)
		bk[i] -= dot*tmp[i];
	}
	while (s-- > 0) {
	    for(i=0; i<n; i++) {
		tmp[i] = 0;
		for (j=0; j<n; j++) 
		    tmp[i] += v[i][j] * bk[j];
	    }
	    tmp = normalize(tmp);
	    //	if (science.lin.dot(tmp, b) > (1 - eps))
	    //	    break;
	    bk = tmp; tmp = b[k]; b[k] = bk;  // swap b/tmp
	}
    }
    return b;
};
