import { range } from './range';
import { debug } from './core';
import { correlation } from './correlation';
import { optimal_leaf_order } from './optimal_leaf_order';
import { permute } from './permute';

export function array_to_dicts(data, axes = range(data[0].length)) {
  const ret = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const dict = {};
    for (let j = 0; j < row.length; j++) {
      dict[axes[j]] = row[j];
    }
    ret.push(dict);
  }
  return ret;
}

export function dicts_to_array(dicts, keys = Object.keys(dicts[0])) {
  const n = keys.length;
  const m = dicts.length;
  const array = Array(m);

  for (let i = 0; i < m; i++) {
    const row = Array(n);
    array[i] = row;
    for (let j = 0; j < n; j++) {
      row[j] = dicts[i][keys[j]];
    }
  }
  return array;
}

function abs_matrix(x) {
  return x.map((y) => y.map(Math.abs));
}

function pcp_flip_axes(perm, pcor) {
  const signs = [1];
  let sign = 1;
  let negs = 0;
  for (let i = 1; i < perm.length; i++) {
    const c = pcor[perm[i - 1]][perm[i]];
    if (c < 0) {
      sign = -sign;
    }
    if (sign < 0) {
      signs.push(-1);
      negs++;
    } else {
      signs.push(1);
    }
  }
  if (debug) {
    console.log(signs);
  }
  if (negs > perm.length / 2) {
    for (let i = 0; i < perm.length; i++) {
      signs[i] = -signs[i];
    }
  }
  return signs;
}

export function pcp(tdata, axes) {
  if (!axes) {
    axes = range(tdata.length);
  }

  const pcor = correlation.pearsonMatrix(tdata);
  const abs_pcor = abs_matrix(pcor);
  const perm = optimal_leaf_order().distanceMatrix(abs_pcor)(tdata);
  const naxes = permute(axes, perm);
  const signs = pcp_flip_axes(perm, pcor);
  return [naxes, signs, perm, pcor];
}

export function parcoords(p) {
  p.detectDimensions().autoscale();

  const data = p.data();
  const types = p.types();
  const hidden = p.hideAxis();
  const yscale = p.yscale;
  const discarded = [];
  const tdata = [];
  let dimensions = p.dimensions();

  for (let i = 0; i < dimensions.length; i++) {
    const d = dimensions[i];
    if (hidden.includes(d)) {
      // remove dimension
      dimensions.splice(i, 1);
      discarded.push(d);
      i--;
    } else if (types[d] == 'number' || types[d] == 'date') {
      const row = [];
      const scale = yscale[d];
      for (let j = 0; j < data.length; j++) {
        row.push(scale(data[j][d]));
      }
      tdata.push(row);
    } else {
      // remove dimension
      dimensions.splice(i, 1);
      discarded.push(d);
      i--;
    }
  }
  const [naxes, signs] = pcp(tdata, dimensions);

  // put back string and hidden columns
  dimensions = naxes.concat(discarded.reverse());
  p.dimensions(dimensions);
  p.hideAxis(hidden);
  for (let i = 0; i < signs.length; i++) {
    if (signs[i] < 0) {
      p.flip(dimensions[i]);
    }
  }
}

export function parcoords_es(p) {
  const dimensions = p.dimensions();
  const data = p.data();
  const ignored = [];
  const axes = [];
  const tdata = [];

  for (const d in dimensions) {
    const val = dimensions[d];
    if (val.type == 'number' || val.type == 'date') {
      const row = [];
      const scale = val.yscale;
      for (let j = 0; j < data.length; j++) {
        row.push(scale(data[j][d]));
      }
      tdata.push(row);
      axes.push(d);
    } else {
      ignored.push(d);
    }
  }
  const [naxes, signs] = pcp(tdata, axes);
  const ndomain = naxes.concat(ignored.reverse());
  // change the order in the xscale
  p.xscale.domain(ndomain);
  p.sortDimensions();
  for (let i = 0; i < signs.length; i++) {
    if (signs[i] < 0) {
      p.flip(ndomain[i]);
    }
  }
}

