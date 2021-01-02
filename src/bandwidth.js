import { range } from './range';
import { inverse_permutation } from './permutation';

export function bandwidth(graph, order) {
  if (!order) {
    order = range(graph.nodes().length);
  }

  const inv = inverse_permutation(order);
  const links = graph.links();
  let max = 0;

  for (let i = 0; i < links.length; i++) {
    const e = links[i];
    const d = Math.abs(inv[e.source.index] - inv[e.target.index]);
    max = Math.max(max, d);
  }
  return max;
}
