import { permutation } from './permutation';
import { zeroes } from './aliases';

/* Fisher-Yates shuffle.
   See http://bost.ocks.org/mike/shuffle/
 */
export function randomPermute(array, i = 0, j = array.length) {
  let m = j - i,
    t,
    k;
  while (m > 0) {
    k = i + Math.floor(Math.random() * m--);
    t = array[i + m];
    array[i + m] = array[k];
    array[k] = t;
  }
  return array;
}

export function randomPermutation(n) {
  return randomPermute(permutation(n));
}

export function random_array(n, min, max) {
  const ret = Array(n);
  if (arguments.length == 1) {
    while (n) ret[--n] = Math.random();
  } else if (arguments.length == 2) {
    while (n) ret[--n] = Math.random() * min;
  } else {
    while (n) ret[--n] = min + Math.random() * (max - min);
  }
  return ret;
}

export function random_matrix(p, n, m, sym) {
  if (!m) m = n;
  if (n != m) sym = false;
  else if (!sym) sym = true;
  const mat = zeroes(n, m);
  let i;
  let j;
  let cnt;

  if (sym) {
    for (i = 0; i < n; i++) {
      cnt = 0;
      for (j = 0; j < i + 1; j++) {
        if (Math.random() < p) {
          mat[i][j] = mat[j][i] = 1;
          cnt++;
        }
      }
      if (cnt === 0) {
        j = Math.floor((Math.random() * n) / 2);
        mat[i][j] = mat[j][i] = 1;
      }
    }
  } else {
    for (i = 0; i < n; i++) {
      cnt = 0;
      for (j = 0; j < m; j++) {
        if (Math.random() < p) {
          mat[i][j] = 1;
          cnt++;
        }
      }
      if (cnt === 0) mat[i][Math.floor(Math.random() * m)] = 1;
    }
  }
  return mat;
}
