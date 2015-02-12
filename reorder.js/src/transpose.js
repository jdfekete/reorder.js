reorder.transpose = science.lin.transpose;

reorder.transposeSlice = function(a, start, end) {
    if (arguments.length < 3) {
	end = a[0].length;
	if (arguments.length < 2) {
	    start = 0;
	}
    }
    var m = a.length,
	n = end,
	i = start-1,
	j,
	b = new Array(end-start);
    while (++i < n) {
	b[i] = new Array(m);
	j = -1; while (++j < m) b[i-start][j] = a[j][i];
    }
    return b;
};
