import { cmp_number } from './utils';
import { inverse_permutation } from './permutation';
import { debug } from './core';
import { count_crossings } from './count_crossings';

export function mult_barycenter_order(graphs, comps, max_iter) {
    let orders = [[], [], 0];
    comps = graphs[0].components();
    const o = barycenter(graphs, comps.flat(), max_iter);
    orders = [orders[0].concat(o[0]), orders[1].concat(o[1]), orders[2] + o[2]];
    return orders;
    
  
  
  return orders;
}

// Take the list of neighbor indexes and return the median according to
// P. Eades and N. Wormald, Edge crossings in drawings of bipartite graphs.
// Algorithmica, vol. 11 (1994) 379â€“403.
function median(neighbors) {
  if (neighbors.length === 0) {
    return 0;
  } // Place on end
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

function count_all_crossings(graphs,layer1,layer2){
    let sum = 0;
    let max = 0;
    for(let i = 0; i<graphs.length; i++){
        var c = count_crossings(graphs[i],layer1,layer2);
        sum += c;
        if(c > max){
            max = c;
        }
    }
    return sum;
}

export function barycenter(graphs, comp, max_iter) {
  var nodes = graphs[0].nodes();
  let crossings;
  let iter;
  let layer;
  let neighbors;
  let med;
  
  const layer1 = comp;
  const layer2 = comp;
  
  
  
  if (comp.length === 1){
      return [comp,comp,0];
  }
  
  
  if (comp.length < 3) {
    return [layer1, layer2, count_all_crossings(graph, layer1, layer2,timesteps)];
  }


  if (!max_iter) {
    max_iter = 24;
  } else if (max_iter % 2 == 1) {
    max_iter++;
  } // want even number of iterations

  let inv_layer = inverse_permutation(layer2);
  
  let best_crossings = count_all_crossings(graphs, layer1, layer2);
  let best_layer1 = layer1.slice();
  let best_layer2 = layer2.slice();
  let best_iter = 0;

  let v;
  const inv_neighbor = (e) =>
    inv_layer[e.source == v ? e.target.index : e.source.index];
    
  function barycenter_sort(graph){
      return (a, b) => {
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
  }
  for (
    layer = layer1, iter = 0;
    iter < max_iter;
    iter++, layer = layer == layer1 ? layer2 : layer1
  ) {
    med = {};
    // Compute median of medians
    for (var t = 0; t < graphs.length; t++) {
        nodes = graphs[t].nodes();
        for (let i = 0; i < layer.length; i++) {
        v = nodes[layer[i]];
        if(t === 0){
              med[v.index] = [];
        }
        if (layer == layer1) {
          neighbors = graphs[t].outEdges(v.index);
        } else {
          neighbors = graphs[t].inEdges(v.index);
        }
            neighbors = neighbors.map(inv_neighbor);
          if(neighbors.length>0){
            med[v.index].push(+median(neighbors));
          }
        }
    }
    nodes = graphs[0].nodes();
    for (let i = 0; i < layer.length; i++) {
        v = nodes[layer[i]];
        if(med[v.index].length>0){
            med[v.index] = d3.median(med[v.index]);
        }
        else{
            med[v.index] = 0;
        }
    }
    
    layer.sort(barycenter_sort(graphs[0])); // ??
    for (let i = 0; i < layer.length; i++) {
      inv_layer = inverse_permutation(layer);
    }
    crossings = count_all_crossings(graphs , layer1, layer2);
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
// TODO change to not work with one graph.