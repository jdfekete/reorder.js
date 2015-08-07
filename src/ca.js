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

function multiply_by_transpose(a,b) {
  var m = a.length,
      n = b.length,
      p = b[0].length,
      i = -1,
      j,
      k;
  if (p !== a[0].length) throw {"error": "columns(a) != rows(b); " + a[0].length + " != " + p};
  var ab = new Array(m);
  while (++i < m) {
    ab[i] = new Array(n);
    j = -1; while(++j < n) {
      var s = 0;
      k = -1; while (++k < p) s += a[i][k] * b[j][k];
      ab[i][j] = s;
    }
  }
  return ab;    
}

// Implementation according to:
// http://web.univ-pau.fr/RECHERCHE/SET/LAFFLY/docs_laffly/INTRODUCTION_AFC.pdf
function ca_no_svd(v, eps) {
    var n = v.length,
	o = v[0].length,
	sumrow = sumrows(v),
	sumcol = sumcols(v),
	s = sum(sumcol),
	i, j, row,
	tmp = Array(n),
	orig = v;
    
    for (i = 0; i < n; i++) {
	row = v[i].slice();
	for (j = 0; j < o; j++) {
	    row[j] /= s;
	}
	tmp[i] = row;
	sumrow[i] /= s;
    }
    for (j = 0; j < o; j++)
	sumcol[j] /= s;
    
    v = tmp; // get rid of original v
    if (reorder.debug) {
	console.log('normalized matrix:');
	reorder.printmat(v);
	console.log('sumrow:'+sumrow);
	console.log('sumcol:'+sumcol);
    }

    var pi = Array(n), // pre inertia matrix
	ep; // don't store the expected values

    for (i = 0; i < n; i++) {
	row = pi[i] = Array(o);
	for (j = 0; j < o; j++) {
	    ep = sumrow[i]*sumcol[j];
	    row[j] = (v[i][j] - ep) / Math.sqrt(ep);
	}
    }
    if (reorder.debug) {
	console.log('Pre inertia:');
	reorder.printmat(pi);
    }

    var wc = Array(n); // weighted coordinates

    for (i = 0; i < n; i++) {
	row = wc[i] = Array(o);
	for (j = 0; j < o; j++) {
	    ep = sumrow[i]*sumcol[j];
	    row[j] = (v[i][j] - ep) / (sumcol[j]*Math.sqrt(sumrow[i]));
	}
    }
    if (reorder.debug) {
	console.log('weighted coordinates:');
	reorder.printmat(wc);
    }

    var inertia = multiply_by_transpose(pi, pi);
    if (reorder.debug) {
	console.log('inertia:');
	reorder.printmat(inertia);
    }
    
    var eigenvector = reorder.poweriteration_n(inertia,1, null, eps),
	eigenvalue = eigenvector[1][0];
    eigenvector = eigenvector[0][0];
    if (reorder.debug)
	console.log('Eigenvalue: '+eigenvalue);

    var cols = Array(o);
    for (j = 0; j < o; j++) {
	cols[j] = wc[0][j]*eigenvalue;
    }
    if (reorder.debug) {
	console.log('Col vector:'+cols);
    }

    var rows = Array(n);
    for (i = 0; i < n; i++) {
	s = 0;
	for (j = 0; j < o; j++) {
	    s += v[i][j]*cols[j];
	}
	rows[i] = s/(sumrow[i]*Math.sqrt(eigenvalue));
    }
    if (reorder.debug) {
	console.log('Row vector:'+rows);
    }

    return [rows, cols];
}

function rescale(vec, vmin, vmax) {
    var min = vec[0],
	max = vec[0],
	i = vec.length,
	v,
	scale;
    while (i-- > 1) {
	v = vec[i];
	if (v < min)
	    min = v;
	else if (v > max)
	    max = v;
    }
    scale = (vmax-vmin) / (max-min);
    for (i = 0; i < vec.length; i++)
	vec[i] = (vec[i]-min)*scale+vmin;
    return (max - min);
}

function round10(vec) {
    var n = vec.length;
    while (n--)
	vec[n] = Math.round(vec[n]*10)*0.1;
}

// Hill, M. O. 1973.
// Reciprocal averaging: an eigenvector method of ordination.
// J. Ecol. 61:237-49
// http://www.britishecologicalsociety.org/100papers/100_Ecological_Papers/100_Influential_Papers_035.pdf
function ca_reciprocal_averaging(v, eps, init, max_iter) {
    var n = v.length,
	o = v[0].length,
	sumrow = sumrows(v),
	sumcol = sumcols(v),
	i, j, row, s, iter,
	rows = reorder.zeroes(n),
	cols = reorder.zeroes(o),
	prev_cols = reorder.zeroes(n),
	tmp,
	eigenvalue;

    if (! max_iter || max_iter < 10)
	max_iter = 100;

    if (! eps)
	eps = 1e-9;

    if (reorder.debug) {
	console.log('n:'+n);
	console.log('o:'+o);
	console.log('sumrow:'+sumrow);
	console.log('sumcol:'+sumcol);
    }

    if (init) {
	for (j = 0; j < o; j++) {
	    cols[j] = init[j];
	}
    }
    else{
	for (j = 0; j < o; j++) {
	    cols[j] = sumcol[j] / n;
	}
    }
    rescale(cols, 0, 100);
    for (iter = 0; iter < max_iter; iter++) {
	if (reorder.debug)
	    reorder.printvec(cols, 1, null, 'cols at iter '+iter+'=');
	for (i = 0; i < n; i++) {
	    s = 0;
	    row = v[i];
	    for (j = 0; j < o; j++) {
		s += cols[j]*row[j];
	    }
	    rows[i] = s / sumrow[i];
	}
	round10(rows);
	if (reorder.debug)
	    reorder.printvec(rows, 1, null, 'rows at iter '+iter+'=');
	for (j = 0; j < o; j++) {
	    s = 0;
	    for (i = 0; i < n; i++) {
		s += rows[i]*v[i][j];
	    }
	    cols[j] = s / sumcol[j];
	}
	if (reorder.debug)
	    reorder.printvec(cols, 1, null, 'cols at iter '+iter+'=');
	eigenvalue = rescale(cols, 0, 100);
	if (reorder.distance.euclidean(cols, prev_cols) < (reorder.length(cols)*eps))
	    break;
	for (j = 0; j < o; j++) {
	    prev_cols[j] = cols[j];
	}
    }
    eigenvalue /= 100;
    if (reorder.debug)
	console.log('eigenvalue: '+eigenvalue);
    return [rows, cols, eigenvalue];
}

reorder.ca_reciprocal_averaging = ca_reciprocal_averaging;

reorder.ca_no_svd = ca_no_svd;

reorder.ca = ca_no_svd;

