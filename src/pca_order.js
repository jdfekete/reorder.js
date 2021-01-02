import { meancolumns } from './mean';
import { variancecovariance } from './covariance';
import { poweriteration } from './poweriteration';
import { sort_order } from './sort_order';

// Takes a matrix, substract the mean of each row
// so that the mean is 0
function center(v) {
  const n = v.length;

  if (n === 0) return null;

  const mean = meancolumns(v);
  const o = mean.length;
  const v1 = Array(n);
  let i;
  let j;
  let row;

  for (i = 0; i < n; i++) {
    row = v[i].slice(0);
    for (j = 0; j < o; j++) {
      row[j] -= mean[j];
    }
    v1[i] = row;
  }
  return v1;
}

// See http://en.wikipedia.org/wiki/Power_iteration
export function pca1d(v, eps) {
  if (v.length === 0) return null;

  v = center(v);
  const cov = variancecovariance(v);
  return poweriteration(cov, eps);
}

export function pca_order(v, eps) {
  return sort_order(pca1d(v, eps));
}
