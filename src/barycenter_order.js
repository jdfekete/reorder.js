import { cmp_number } from './utils';
import { inverse_permutation } from './permutation';
import { debug } from './core';
import { count_crossings } from './count_crossings';

export function barycenter_order(graph, comps, max_iter) {
  let orders = [[], [], 0];
  // Compute the barycenter heuristic on each connected component
  if (!comps) {
    comps = graph.components();
  }
  for (let i = 0; i < comps.length; i++) {
    const o = barycenter(graph, comps[i], max_iter);
    orders = [orders[0].concat(o[0]), orders[1].concat(o[1]), orders[2] + o[2]];
  }
  return orders;
}

// Take the list of neighbor indexes and return the median according to
// P. Eades and N. Wormald, Edge crossings in drawings of bipartite graphs.
// Algorithmica, vol. 11 (1994) 379–403.
function median(neighbors) {
  if (neighbors.length === 0) {
    return -1;
  } // should not happen
  if (neighbors.length === 1) {
    return neighbors[0];
  }
  if (neighbors.length === 2) {
    return (neighbors[0] + neighbors[1]) / 2;
  }
  neighbors.sort(cmp_number);
  if (neighbors.length % 2) {
    return neighbors[(neighbors.length - 1) / 2];
  }
  const rm = neighbors.length / 2;
  const lm = rm - 1;
  const rspan = neighbors[neighbors.length - 1] - neighbors[rm];
  const lspan = neighbors[lm] - neighbors[0];
  if (lspan == rspan) {
    return (neighbors[lm] + neighbors[rm]) / 2;
  } else {
    return (neighbors[lm] * rspan + neighbors[rm] * lspan) / (lspan + rspan);
  }
}

export function barycenter(graph, comp, max_iter) {
  const nodes = graph.nodes();
  let crossings;
  let iter;
  let layer;
  let neighbors;
  let med;

  let layer1 = comp.filter((n) => graph.outDegree(n) !== 0);
  let layer2 = comp.filter((n) => graph.inDegree(n) !== 0);
  
  // If the layers are equal, we want to modify them simultaneously (for undirected graphs)
  if(!graph.directed()){
      layer1 = layer2;
  }
  
  if (comp.length < 3) {
    return [layer1, layer2, count_crossings(graph, layer1, layer2)];
  }

  if (!max_iter) {
    max_iter = 24;
  } else if (max_iter % 2 == 1) {
    max_iter++;
  } // want even number of iterations

  let inv_layer = inverse_permutation(layer2);

  let best_crossings = count_crossings(graph, layer1, layer2);
  let best_layer1 = layer1.slice();
  let best_layer2 = layer2.slice();
  let best_iter = 0;

  let v;
  const inv_neighbor = (e) =>
    inv_layer[e.source == v ? e.target.index : e.source.index];

  const barycenter_sort = (a, b) => {
    let d = med[a] - med[b];
    if (d === 0) {
      // If both values are equal,
      // place the odd degree vertex on the left of the even
      // degree vertex
      d = (graph.edges(b).length % 2) - (graph.edges(a).length % 2);
    }
    if (d < 0) {
      return -1;
    } else if (d > 0) {
      return 1;
    }
    return 0;
  };

  for (
    layer = layer1, iter = 0;
    iter < max_iter;
    iter++, layer = layer == layer1 ? layer2 : layer1
  ) {
    med = {};
    for (let i = 0; i < layer.length; i++) {
      // Compute the median/barycenter for this node and set
      // its (real) value into node.pos
      v = nodes[layer[i]];
      if (layer == layer1) {
        neighbors = graph.outEdges(v.index);
      } else {
        neighbors = graph.inEdges(v.index);
      }
      neighbors = neighbors.map(inv_neighbor);
      med[v.index] = +median(neighbors);
    }
    layer.sort(barycenter_sort);
    for (let i = 0; i < layer.length; i++) {
      inv_layer = inverse_permutation(layer);
    }
    crossings = count_crossings(graph, layer1, layer2);
    if (crossings < best_crossings) {
      best_crossings = crossings;
      best_layer1 = layer1.slice();
      best_layer2 = layer2.slice();
      best_iter = iter;
      max_iter = Math.max(max_iter, iter + 2); // we improved so go on
    }
  }
  if (debug) {
    console.log(`Best iter: ${best_iter}`);
  }

  return [best_layer1, best_layer2, best_crossings];
}
