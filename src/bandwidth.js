import { range } from './range';
import { inverse_permutation } from './permutation';

/**
 * Compute the bandwidth of a graph, given and order.
 * @param  {Graph} graph - the graph 
 * @param {list} order - a permutation
 * @returns {integer} the bandwidth 
 */
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

/**
 * Compute the bandwidth of an adjacency matrix,
 * i.e. the maximum distace between two endpoints 
 * over all edges.
 * @param  {Matrix} matrix - the matrix
 * @returns {integer} the bandwidth 
 */
export function bandwidth_matrix(matrix) {
  let max = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] > 0) {
        max = Math.max(max, Math.abs(i - j));
      }
    }
  }
  return max;
}
