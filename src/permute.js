export function permute(list, perm) {
  var m = perm.length;
  var copy = list.slice();
  while (m--) copy[m] = list[perm[m]];
  return copy;
}

export function permute_inplace(list, perm) {
  var i, j, v, tmp;

  //list = list.slice();
  for (i = 0; i < list.length; i++) {
    j = perm[i];
    if (j < 0) {
      perm[i] = -1 - j;
      continue;
    }
    v = i;
    while (j != i) {
      tmp = list[j];
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
  var m = array.length;
  while (m-- > 0) array[m] = permute(array[m], indexes);
  return array;
}
