//Corresponence Analysis
// see http://en.wikipedia.org/wiki/Correspondence_analysis

reorder.sumlines = function(v) {
    var n = v.length,
	o = v[0].length,
	sumline = Array(n),
	i, j, row, s;

    for (i = 0; i < n; i++) {
	row = v[i];
	s = 0;
	for (j = 0; j < o; j++)
	    s += row[j];
	sumline[i] = s;
    }
    return sumline;
};

reorder.sumcols = function(v) {
    var n = v.length,
	o = v[0].length,
	sumcol = science.zeroes(o),
	i, j, row;

    for (i = 0; i < n; i++) {
	row = v[i];
	for (j = 0; j < o; j++)
	    sumcol[j] += row[j];
    }
    return sumcol;
}

reorder.ca = function(v, eps) {
    if (arguments.length < 2) 
	eps = 0.0001;

    var n = v.length,
	o = v[0].length,
	sumline = reorder.sumlines(v),
	sumcol = reorder.sumcols(v),
	s = reorder.sum(sumcol),
	i, j, row;

    //reorder.printmat(v);
    //console.log("lines: "+sumline);
    //console.log("cols: "+sumcol);
    //console.log("sum: "+s);
    // switch to frequency
    for (i = 0; i < n; i++) {
	v[i] = v[i].map(function(a) { return a / s; });
    }
    sumline = reorder.sumlines(v);
    sumcol = reorder.sumcols(v);

    //reorder.printmat(v);
    //console.log("lines: "+sumline);
    //console.log("cols: "+sumcol);
    
    var v2 = Array(n), ep;

    for (i = 0; i < n; i++) {
	v2[i] = Array(o);
	for (j = 0; j < o; j++) {
	    ep = sumline[i]*sumcol[j];
	    v2[i][j] = (v[i][j] - ep) / Math.sqrt(ep);
	}
    }
    //reorder.printmat(v2);

    for (i = 0; i < n; i++) {
	for (j = 0; j < o; j++) {
	    ep = sumline[i]*sumcol[j];
	    v[i][j] = (v[i][j] - ep) / (sumcol[j]*Math.sqrt(sumline[i]));
	}
    }
    //reorder.printmat(v);

    var cov = Array(n);
    for (i = 0; i < n; i++)
	cov[i] = Array(n);

    for (i = 0; i < n; i++) 
	for (j = i; j < n; j++) 
	    cov[i][j] = cov[j][i] = reorder.covariance(v2[i], v2[j]);
	    
    //console.log("Variance-Covariance");
    //reorder.printmat(cov);

    var eigenvector1 = reorder.poweriteration(cov, eps),
	eigenvalue1 = 0;
    for (i = 0; i < n; i++)
	eigenvalue1 += eigenvector1[i]*cov[i][0];
    eigenvalue1 /= eigenvector1[0];
    //console.log("Eigenvalue1="+eigenvalue1);

    return eigenvector1;
};

