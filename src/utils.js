// Use as: [4,3,2].sort(cmp_number_asc);
export function cmp_number_asc(a, b) {
  return a - b;
}
export const cmp_number = cmp_number_asc;

// Use as: [4,3,2].sort(cmp_number_desc);
export function cmp_number_desc(a, b) {
  return b - a;
}

// Use as: [[4,3],[2]].reduce(flaten);
export function flatten(a, b) {
  return a.concat(b);
}

// Constructs a multi-dimensional array filled with Infinity.
export function infinities(n) {
  let i = -1;
  const a = [];
  if (arguments.length === 1) while (++i < n) a[i] = Infinity;
  else
    while (++i < n)
      a[i] = infinities.apply(this, Array.prototype.slice.call(arguments, 1));
  return a;
}

export function array1d(n, v) {
  let i = -1;
  const a = Array(n);
  while (++i < n) a[i] = v;
  return a;
}

export function check_distance_matrix(mat, tol) {
  const n = mat.length;

  if (!tol) tol = 1e-10;

  if (n != mat[0].length) return 'Inconsistent dimensions';

  for (let i = 0; i < n - 1; i++) {
    const row = mat[i];
    let v1 = row[i];
    if (v1 < 0) return `Negative value at diagonal ${i}`;
    if (v1 > tol) return `Diagonal not zero at ${i}`;
    for (let j = 1; j < n; j++) {
      v1 = row[j];
      const v2 = mat[j][i];
      if (Math.abs(v1 - v2) > tol) return `Inconsistency at ${i},${j}`;
      if (v1 < 0) return `Negative value at ${i},${j}`;
      if (v2 < 0) return `Negative value at ${j},${i}`;
    }
  }
  return false;
}

export function fix_distance_matrix(mat, tol) {
  const n = mat.length;
  if (!tol) tol = 1e-10;

  if (n != mat[0].length)
    throw `Inconsistent dimensions ${n} != ${mat[0].length}`;

  for (let i = 0; i < n - 1; i++) {
    const row = mat[i];
    let v1 = row[i];
    if (v1 < 0) {
      if (-v1 > tol) throw `Negative value at diagonal${i}`;
      v1 = row[i] = 0;
    } else if (v1 > tol) {
      throw `Diagonal not zero at ${i}`;
    }
    for (let j = 1; j < n; j++) {
      v1 = row[j];
      let v2 = mat[j][i];
      if (Math.abs(v1 - v2) > tol) throw `Inconsistency at ${i},${j}`;
      if (v1 < 0) v1 = 0;
      if (v2 < 0) v2 = 0;
      if (v1 != v2) {
        v1 += v2;
        v1 /= 2;
      }
      row[j] = v1;
      mat[j][i] = v1;
    }
  }
  return mat;
}
