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
