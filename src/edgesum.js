import { range } from './range';
import { inverse_permutation } from './permutation';

export function edgesum(graph, order) {
  if (!order) {
    order = range(graph.nodes().length);
  }

  const inv = inverse_permutation(order);
  const links = graph.links();
  let sum = 0;

  for (let i = 0; i < links.length; i++) {
    const e = links[i];
    const d = Math.abs(inv[e.source.index] - inv[e.target.index]);
    sum += d;
  }
  return sum;
}
