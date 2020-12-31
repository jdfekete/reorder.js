export function transposeSlice(a, start, end) {
  if (arguments.length < 3) {
    end = a[0].length;
    if (arguments.length < 2) {
      start = 0;
    }
  }
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
