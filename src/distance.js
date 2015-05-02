function isNum(a, b) {
    return !(isNaN(a) || isNaN(b) || a==Infinity || b == Infinity);
}
reorder.distance = {
    euclidean: function(a, b) {
	var i = a.length,
            s = 0,
            x;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		x = a[i] - b[i];
		s += x * x;
	    }
	}
	return Math.sqrt(s);
    },
    manhattan: function(a, b) {
	var i = a.length,
            s = 0;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		s += Math.abs(a[i] - b[i]);
	    }
	}
	return s;
    },
    minkowski: function(p) {
	return function(a, b) {
	    var i = a.length,
		s = 0;
	    while (i-- > 0) {
		if (isNum(a[i], b[i])) {
		    s += Math.pow(Math.abs(a[i] - b[i]), p);
		}
	    }
	    return Math.pow(s, 1 / p);
	};
    },
    chebyshev: function(a, b) {
	var i = a.length,
            max = 0,
            x;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		x = Math.abs(a[i] - b[i]);
		if (x > max) max = x;
	    }
	}
	return max;
    },
    hamming: function(a, b) {
	var i = a.length,
            d = 0;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		if (a[i] !== b[i]) d++;
	    }
	}
	return d;
    },
    jaccard: function(a, b) {
	var n = 0,
            i = a.length,
            s = 0;
	while (i-- > 0) {
	    if (isNum(a[i], b[i])) {
		if (a[i] === b[i]) s++;
		n++;
	    }
	}
	if (n === 0) return 0;
	return s / n;
    },
    braycurtis: function(a, b) {
	var i = a.length,
            s0 = 0,
            s1 = 0,
            ai,
            bi;
	while (i-- > 0) {
	    ai = a[i];
	    bi = b[i];
	    if (isNum(ai, bi)) {
		s0 += Math.abs(ai - bi);
		s1 += Math.abs(ai + bi);
	    }
	}
	if (s1 === 0) return 0;
	return s0 / s1;
    }
};
