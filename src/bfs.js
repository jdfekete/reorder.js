import { Queue } from './queue';
import { flatten, cmp_number } from './utils';

export function bfs(graph, v, fn) {
  const q = new Queue();
  const discovered = {};
  let i;
  let e;
  let v2;
  let edges;
  q.push(v);
  discovered[v] = true;
  fn(v, undefined);
  while (q.length) {
    v = q.shift();
    fn(v, v);
    edges = graph.edges(v);
    for (i = 0; i < edges.length; i++) {
      e = edges[i];
      v2 = graph.other(e, v).index;
      if (!discovered[v2]) {
        q.push(v2);
        discovered[v2] = true;
        fn(v, v2);
      }
    }
    fn(v, -1);
  }
}

export function bfs_distances(graph, v) {
  const dist = {};
  dist[v] = 0;
  bfs(graph, v, (v, c) => {
    if (c >= 0 && v != c) dist[c] = dist[v] + 1;
  });
  return dist;
}

export function all_pairs_distance_bfs(graph, comps) {
  if (!comps) comps = [graph.nodes_indices()];
  const nodes = comps.reduce(flatten).sort(cmp_number);
  const mat = Array(nodes.length);
  let i;
  let j;
  let dist;

  for (i = 0; i < nodes.length; i++) mat[i] = Array(nodes.length);

  for (i = 0; i < nodes.length; i++) {
    dist = bfs_distances(graph, i);
    for (j in dist) {
      mat[i][j] = dist[j];
      mat[j][i] = dist[j];
    }
  }
  return mat;
}
