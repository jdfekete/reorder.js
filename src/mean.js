reorder.mean = science.stats.mean;

reorder.meantranspose = function(v, j) {
    var n = v.length;
    if (n === 0) return NaN;
    var o = v[0].length,
	m = 0,
	i = -1,
	row;

    while(++i < n) m += (v[i][j] - m) / (i+1);

    return m;
};

reorder.meancolumns = function(v) {
    var n = v.length;
    if (n === 0) return NaN;
    var o = v[0].length,
	m = v[0].slice(0),
	i = 0,
	j, row;

    while(++i < n) {
	row = v[i];
	for (j = 0; j < o; j++)
	    m[j] += (row[j] - m[j]) / (i+1);
    }

    return m;
};

