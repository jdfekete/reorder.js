export function sum(v) {
  let i = v.length,
    s = 0;
  while (i-- > 0) if (!isNaN(v[i])) s += v[i];
  return s;
}
