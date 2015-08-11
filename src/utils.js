// Use as: [4,3,2].sort(reorder.cmp_number_asc);
reorder.cmp_number_asc = function(a,b) { return a-b; };
reorder.cmp_number = reorder.cmp_number_asc;

// Use as: [4,3,2].sort(reorder.cmp_number_desc);
reorder.cmp_number_desc = function(a,b) { return b-a; };

// Use as: [[4,3],[2]].reduce(reorder.flaten);
reorder.flatten = function(a,b) { return a.concat(b); };

// Constructs a multi-dimensional array filled with Infinity.
reorder.infinities = function(n) {
    var i = -1,
	a = [];
    if (arguments.length === 1)
	while (++i < n)
	    a[i] = Infinity;
    else
	while (++i < n)
	    a[i] = reorder.infinities.apply(
		this, Array.prototype.slice.call(arguments, 1));
    return a;
};

reorder.array1d = function(n, v) {
    var i = -1,
	a = Array(n);
    while (++i < n)
	a[i] = v;
    return a;
};

function check_distance_matrix(mat, tol) {
    var i, j, v1, v2, n = mat.length, row;
    if (! tol)
	tol = 1e-10;

    if (n != mat[0].length)
	return "Inconsistent dimensions";
    
    for (i = 0; i < (n-1); i++) {
	row = mat[i];
	v1 = row[i];
	if (v1 < 0)
	    return "Negative value at diagonal "+i;
	if (v1 > tol)
	    return "Diagonal not zero at "+i;
	for (j = 1; j < n; j++) {
	    v1 = row[j];
	    v2 = mat[j][i];
	    if (Math.abs(v1 - v2) > tol)
		return "Inconsistency at "+i+","+j;
	    if (v1 < 0)
		return "Negative value at "+i+","+j;
	    if (v2 < 0)
		return "Negative value at "+j+","+i;
	}
    }
    return false;
}

function fix_distance_matrix(mat, tol) {
    var i, j, v1, v2, n = mat.length, row;
    if (! tol)
	tol = 1e-10;

    if (n != mat[0].length)
	throw "Inconsistent dimensions "+n+" != "+mat[0].length;
    
    for (i = 0; i < (n-1); i++) {
	row = mat[i];
	v1 = row[i];
	if (v1 < 0) {
	    if (-v1 > tol)
		throw "Negative value at diagonal"+i;
	    v1 = row[i] = 0;
	}
	else if (v1 > tol) {
	    throw "Diagonal not zero at "+i;
	}
	for (j = 1; j < n; j++) {
	    v1 = row[j];
	    v2 = mat[j][i];
	    if (Math.abs(v1 - v2) > tol)
		throw "Inconsistency at "+i+","+j;
	    if (v1 < 0)
		v1 = 0;
	    if (v2 < 0)
		v2 = 0;
	    if (v1 != v2) {
		v1 += v2;
		v1 /= 2;
	    }
	    row[j] = v1;
	    mat[j][i] = v1;
	}
    }
    return mat;
}
