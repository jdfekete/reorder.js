function array_to_dicts(data, axes) {
    if (arguments.length < 2) 
	axes = reorder.range(data[0].length);
    var ret = [], row, dict, i, j;
    for (i = 0; i < data.length; i++) {
	row = data[i];
	dict = {};
	for (j = 0; j < row.length; j++) {
	    dict[axes[j]] = row[j];
	}
	ret.push(dict);
    }
    return ret;
}

reorder.array_to_dicts = array_to_dicts;

function dicts_to_array(dicts, keys) {
    if (arguments.length < 2)
	keys = Object.keys(dicts[0]);
    var n = keys.length,
	m = dicts.length,
	array = Array(m), i, j, row;

    for (i = 0; i < m; i++) {
	row = Array(n);
	array[i] = row;
	for (j = 0; j < n; j++)
	    row[j] = dicts[i][keys[j]];
    }
    return array;
}

reorder.dicts_to_array = dicts_to_array;

function abs_matrix(x) {
    return x.map(function(y) { return y.map(Math.abs); });
}

function pcp_flip_axes(tdata, perm, naxes, pcor) {
    var i, c, sign = 1, signs = [1], negs=0;
    for (i = 1; i < tdata.length; i++) {
	c = pcor[perm[i-1]][perm[i]];
	if (c < 0)
	    sign = -sign;
	if (sign < 0) {
	    signs.push(-1);
	    negs++;
	}
	else
	    signs.push(1);
    }
    //console.log(signs);
    sign = (negs > (tdata.length-negs)) ? -1 : 1;
    if (sign==-1) {
	for (i = 0; i < (tdata.length-1); i++)
	    signs[i] = signs[i]*sign;
    }
    return signs;
}

function pcp(data, axes, invert) {
    if (! axes)
	axes = reorder.range(data[0].length);
    
    var tdata = reorder.transpose(data),
	pcor = reorder.correlation.pearsonMatrix(tdata),
	abs_pcor = abs_matrix(pcor),
	h1 = science.stats.hcluster()
	    .linkage("complete")
	    .distanceMatrix(abs_pcor)(tdata),
	perm = reorder.optimal_leaf_order()
	    .distanceMatrix(abs_pcor)(tdata),
	naxes = reorder.permute(axes, perm);
    tdata = reorder.permute(tdata, perm);

    
    var signs = pcp_flip_axes(tdata, perm, naxes, pcor),
	ndata = reorder.transpose(tdata);
    return [ndata, perm, naxes, signs, pcor];
}

reorder.pcp = pcp;

