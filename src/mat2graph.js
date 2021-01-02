import { graph } from './graph';

export function mat2graph(mat, directed) {
  const n = mat.length;
  const nodes = [];
  const links = [];
  let max_value = Number.NEGATIVE_INFINITY;
  let i;
  let j;
  let v;
  let m;

  for (i = 0; i < n; i++) nodes.push({ id: i });

  for (i = 0; i < n; i++) {
    v = mat[i];
    m = directed ? 0 : i;

    for (j = m; j < v.length; j++) {
      if (j == nodes.length) nodes.push({ id: j });
      if (v[j] !== 0) {
        if (v[j] > max_value) max_value = v[j];
        links.push({ source: i, target: j, value: v[j] });
      }
    }
  }
  return graph(nodes, links, directed)
    .linkDistance((l) => 1 + max_value - l.value)
    .init();
}
