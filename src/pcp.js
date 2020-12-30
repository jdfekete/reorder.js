import { range } from './range';
import { debug } from './core';
import { transpose } from './aliases';
import { correlation } from './correlation';
import { optimal_leaf_order } from './optimal_leaf_order';
import { permute } from './permute';

export function array_to_dicts(data, axes) {
    if (arguments.length < 2) 
	axes = range(data[0].length);
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

export function dicts_to_array(dicts, keys) {
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

function abs_matrix(x) {
    return x.map(function(y) { return y.map(Math.abs); });
}

function pcp_flip_axes(perm, naxes, pcor) {
    var i, c, sign = 1, signs = [1], negs=0;
    for (i = 1; i < perm.length; i++) {
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
    if (debug)
	console.log(signs);
    sign = (negs > (perm.length-negs)) ? -1 : 1;
    if (sign==-1) {
	for (i = 0; i < (perm.length-1); i++)
	    signs[i] = signs[i]*sign;
    }
    return signs;
}

export function pcp(data, axes) {
    if (! axes)
	axes = range(data[0].length);
    
    var tdata = transpose(data),
	pcor = correlation.pearsonMatrix(tdata),
	abs_pcor = abs_matrix(pcor),
	h1 = science.stats.hcluster()
	    .linkage("complete")
	    .distanceMatrix(abs_pcor)(tdata),
	perm = optimal_leaf_order()
	    .distanceMatrix(abs_pcor)(tdata),
	naxes = permute(axes, perm);
    tdata = permute(tdata, perm);

    
    var signs = pcp_flip_axes(perm, naxes, pcor),
	ndata = transpose(tdata);
    return [ndata, perm, naxes, signs, pcor];
}

export function parcoords(p) {
    p.detectDimensions()
	.autoscale();

    var data = p.data(),
	types = p.types(),
	dimensions = p.dimensions(),
	tdata = [], row, discarded = [],
	i, j, k, d;

    for (i = 0; i < dimensions.length; i++) {
	d = dimensions[i];
	if (types[d] == 'number') {
	    row = [];
	    for (j = 0; j < data.length; j++)
		row.push(data[j][d]);
	    tdata.push(row);
	}
	else if (types[d] == 'date') {
	    row = [];
	    for (j = 0; j < data.length; j++)
		row.push(data[j][d].getTime()*0.001);
	    tdata.push(row);
	}
	else {
	    // remove dimension
	    dimensions.splice(i, 1);
	    discarded.push(d);
	    i--;
	}
    }
    var pcor = correlation.pearsonMatrix(tdata),
	abs_pcor = abs_matrix(pcor),
	h1 = science.stats.hcluster()
	    .linkage("complete")
	    .distanceMatrix(abs_pcor)(tdata),
	perm = optimal_leaf_order()
	    .distanceMatrix(abs_pcor)(tdata),
	naxes = permute(dimensions, perm);
    tdata = permute(tdata, perm);
    
    var signs = pcp_flip_axes(perm, naxes, pcor);
    for (i = 0; i < signs.length; i++) {
	if (signs[i] < 0)
	    p.flip(dimensions[i]);
    }
    dimensions = discarded.reverse().concat(dimensions); // put back string columns
    return p.dimensions(dimensions);
}
