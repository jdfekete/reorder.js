import { zeroes } from './aliases';
import { assert } from './debug';
import { inverse_permutation } from './permutation';

export function laplacian(graph, comp) {
  const n = comp.length;
  const lap = zeroes(n, n);
  const inv = inverse_permutation(comp);
  let i;
  let j;
  let k;
  let row;
  let sum;
  let edges;
  let v;
  let e;
  let other;

  assert(!graph.directed(), 'Laplacian only for undirected graphs');
  for (i = 0; i < n; i++) {
    v = comp[i];
    row = lap[i];
    sum = 0;
    edges = graph.edges(v);
    for (j = 0; j < edges.length; j++) {
      e = edges[j];
      other = inv[graph.other(e, v).index];
      if (other != i) {
        sum += e.value;
        row[other] = -e.value;
      }
    }
    row[i] = sum;
  }

  return lap;
}
