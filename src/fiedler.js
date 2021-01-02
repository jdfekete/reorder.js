import { debug } from './core';
import { poweriteration_n } from './poweriteration';
import { array1d } from './utils';
import { random_array } from './random';

// Compute the Fiedler vector, the smallest non-null eigenvector of a matrix.
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
  let max = 0;
  const n = B.length;
  for (let i = 0; i < n; i++) {
    const row = B[i];
    let t = row[i];
    for (let j = 0; j < n; j++) if (j != i) t += Math.abs(row[j]);
    if (t > max) max = t;
  }
  if (debug) {
    console.log('gershgorin_bound=%d', max);
  }
  return max;
}

export function fiedler_vector(B, eps) {
  const g = gershgorin_bound(B);
  const n = B.length;

  // Copy B
  const Bhat = B.map((row) => row.slice());

  for (let i = 0; i < n; i++) {
    const row = Bhat[i];
    for (let j = 0; j < n; j++) {
      if (i == j) row[j] = g - row[j];
      else row[j] = -row[j];
    }
  }
  const init = [array1d(n, 1), random_array(n)];
  const eig = poweriteration_n(Bhat, 2, init, eps, 1);
  return eig[0][1];
}
