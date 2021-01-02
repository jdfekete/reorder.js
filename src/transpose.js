export function transposeSlice(a, start = 0, end = a[0].length) {
  const m = a.length;
  const n = end;
  let i = start - 1;
  let j;
  const b = new Array(end - start);
  while (++i < n) {
    b[i] = new Array(m);
    j = -1;
    while (++j < m) b[i - start][j] = a[j][i];
  }
  return b;
}
