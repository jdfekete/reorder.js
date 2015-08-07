// Compute te Fiedler vector, the smallest non-null eigenvector of a matrix.
// See:
// Yehuda Koren, Liran Carmel, David Harel
// ACE: A Fast Multiscale Eigenvector Computation for Drawing Huge Graphs
// Extended version, available at:
// http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.19.7702&rep=rep1&type=pdf
// Transform the matrix B to reverse the order of the eigenvectors.
// B' = g . (I - B) where g is the Gershgorin bound, an upper bound
// for (the absolute value of) the largest eigenvalue of a matrix.
// Also, the smallest eigenvector is 1^n 

function gershgorin_bound(B) {
    var i, j, max = 0, n = B.length, 
	t, row;
    for (i = 0; i < n; i++) {
	row = B[i];
	t = row[i];
	for (j = 0; j < n; j++)
	    if (j != i)
		t += Math.abs(row[j]);
	if (t > max)
	    max = t;
    }
    if (reorder.debug) {
	console.log('gershgorin_bound=%d', max);
    }
    return max;
}

function fiedler_vector(B, eps) {
    var g = gershgorin_bound(B),
	n = B.length,
	// Copy B
	Bhat = B.map(function(row) { return row.slice(); }),
	i, j, row;
    for (i = 0; i < n; i++) {
	row = Bhat[i];
	for (j = 0; j < n; j++) {
	    if (i == j)
		row[j] = g - row[j];
	    else
		row[j] = - row[j];
	}
    }
    var init = [ reorder.array1d(n, 1), reorder.random_array(n) ],
	eig = reorder.poweriteration_n(Bhat, 2, init, eps, 1);
    return eig[0][1];
}

reorder.fiedler_vector = fiedler_vector;
