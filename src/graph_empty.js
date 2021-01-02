import { graph } from './graph';

export function graph_empty_nodes(n) {
  const nodes = Array(n);
  let i;
  for (i = 0; i < n; i++) nodes[i] = { id: i };
  return nodes;
}

export function graph_empty(n, directed) {
  return graph(graph_empty_nodes(n), [], directed);
}
