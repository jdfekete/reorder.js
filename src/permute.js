export function permute(list, perm) {
  let m = perm.length;
  const copy = list.slice();
  while (m--) {
    copy[m] = list[perm[m]];
  }
  return copy;
}

export function permute_inplace(list, perm) {
  for (let i = 0; i < list.length; i++) {
    let j = perm[i];
    if (j < 0) {
      perm[i] = -1 - j;
      continue;
    }
    let v = i;
    while (j != i) {
      let tmp = list[j];
      list[j] = list[v];
      list[v] = tmp;
      v = j;
      tmp = perm[j];
      perm[j] = -1 - tmp;
      j = tmp;
    }
  }
  return list;
}

export function permutetranspose(array, indexes) {
  let m = array.length;
  while (m-- > 0) {
    array[m] = permute(array[m], indexes);
  }
  return array;
}

export function permute_matrix(matrix, row_perm, col_perm) {
  if (!col_perm) {
    col_perm = row_perm;
  }
  let permuted = [];
  for (let i = 0; i < matrix.length; i++) {
    permuted.push([]);
    for (let j = 0; j < matrix[0].length; j++) {
      permuted[i].push(matrix[row_perm[i]][col_perm[j]]);
    }
  }
  return permuted;
}
