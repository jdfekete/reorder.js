export function sum(v) {
  let i = v.length;
  let s = 0;
  while (i-- > 0) if (!isNaN(v[i])) s += v[i];
  return s;
}
