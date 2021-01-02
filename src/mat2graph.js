import { graph } from './graph';

export function mat2graph(mat, directed) {
  const n = mat.length;
  const nodes = [];
  const links = [];
  let max_value = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < n; i++) {
    nodes.push({ id: i });
  }

  for (let i = 0; i < n; i++) {
    const v = mat[i];
    const m = directed ? 0 : i;

    for (let j = m; j < v.length; j++) {
      if (j == nodes.length) {
        nodes.push({ id: j });
      }
      if (v[j] !== 0) {
        if (v[j] > max_value) {
          max_value = v[j];
        }
        links.push({ source: i, target: j, value: v[j] });
      }
    }
  }
  return graph(nodes, links, directed)
    .linkDistance((l) => 1 + max_value - l.value)
    .init();
}
