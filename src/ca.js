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

function ca(v, eps) {
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
    //console.log('normalized matrix:');
    //reorder.printmat(v);
    //console.log('sumrow:'+sumrow);
    //console.log('sumcol:'+sumcol);

    var pi = Array(n), // pre inertia matrix
	ep; // don't store the expected values

    for (i = 0; i < n; i++) {
	row = pi[i] = Array(o);
	for (j = 0; j < o; j++) {
	    ep = sumrow[i]*sumcol[j];
	    row[j] = (v[i][j] - ep) / Math.sqrt(ep);
	}
    }
    //console.log('Pre inertia:');
    //reorder.printmat(pi);

    var wc = Array(n); // weighted coordinates

    for (i = 0; i < n; i++) {
	row = wc[i] = Array(o);
	for (j = 0; j < o; j++) {
	    ep = sumrow[i]*sumcol[j];
	    row[j] = (v[i][j] - ep) / (sumcol[j]*Math.sqrt(sumrow[i]));
	}
    }
    //console.log('weighted coordinates:');
    //reorder.printmat(wc);

    var inertia = multiply_by_transpose(pi, pi);
    //console.log('inertia:');
    //reorder.printmat(inertia);
    
    var eigenvector = reorder.poweriteration_n(inertia,1, null, eps),
	eigenvalue = eigenvector[1][0];
    eigenvector = eigenvector[0][0];
    //console.log('Eigenvalue: '+eigenvalue);

    var cols = Array(o);
    for (j = 0; j < o; j++) {
	cols[j] = wc[0][j]*eigenvalue;
    }
    //console.log('Col vector:'+cols);

    var rows = Array(n);
    for (i = 0; i < n; i++) {
	s = 0;
	for (j = 0; j < o; j++) {
	    s += v[i][j]*cols[j];
	}
	rows[i] = s/(sumrow[i]*Math.sqrt(eigenvalue));
    }
    //console.log('Row vector:'+rows);

    return [rows, cols];
}

reorder.ca = ca;
