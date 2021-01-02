import { zeroes } from './aliases';
import { assert } from './debug';
import { inverse_permutation } from './permutation';

export function laplacian(graph, comp) {
  const n = comp.length;
  const lap = zeroes(n, n);
  const inv = inverse_permutation(comp);

  assert(!graph.directed(), 'Laplacian only for undirected graphs');
  for (let i = 0; i < n; i++) {
    const v = comp[i];
    const row = lap[i];
    let sum = 0;
    const edges = graph.edges(v);
    for (let j = 0; j < edges.length; j++) {
      const e = edges[j];
      const other = inv[graph.other(e, v).index];
      if (other != i) {
        sum += e.value;
        row[other] = -e.value;
      }
    }
    row[i] = sum;
  }

  return lap;
}
