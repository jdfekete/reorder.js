/* Fisher-Yates shuffle.
   See http://bost.ocks.org/mike/shuffle/
 */
reorder.randomPermute = function(array, i, j) {
    if (arguments.length < 3) {
	j = array.length;
	if (arguments.length < 2) {
	    i = 0;
	}
    }
    var m = j-i, t, k;
    while (m > 0) {
	k = i+Math.floor(Math.random() * m--);
	t = array[i+m];
	array[i+m] = array[k];
	array[k] = t;
    }
    return array;
};

reorder.randomPermutation = function(n) {
    return reorder.randomPermute(reorder.permutation(n));
};

reorder.random_array = function(n, min, max) {
    var ret = Array(n);
    if (arguments.length == 1) {
	while(n) ret[--n] = Math.random();
    }
    else if (arguments.length == 2) {
	while(n) ret[--n] = Math.random()*min;
    }
    else {
	while(n) ret[--n] = min + Math.random()*(max-min);
    }
    return ret;
};

reorder.random_matrix = function(p, n, m, sym) {
    if (! m)
	m = n;
    if (n != m)
	sym = false;
    else if (! sym)
	sym = true;
    var mat = reorder.zeroes(n, m), i, j, cnt;

    if (sym) {
	for (i = 0; i < n; i++) {
	    cnt = 0;
	    for (j = 0; j < i+1; j++) {
		if (Math.random() < p) {
		    mat[i][j] = mat[j][i] = 1;
		    cnt++;
		}
	    }
	    if (cnt === 0) {
		j = Math.floor(Math.random()*n/2);
		mat[i][j] = mat[j][i] = 1;
	    }
	}
    }
    else {
	for (i = 0; i < n; i++) {
	    cnt = 0;
	    for (j = 0; j < m; j++) {
		if (Math.random() < p) {
		    mat[i][j] = 1;
		    cnt++;
		}
	    }
	    if (cnt === 0)
		mat[i][Math.floor(Math.random()*m)] = 1;
	}
    }
    return mat;
};

