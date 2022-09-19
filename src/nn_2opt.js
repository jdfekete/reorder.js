import { distance as distances } from './distance';
import { dist } from './dist';

export function nn_2opt() {
  let distanceMatrix = null;
  let distance = distances.euclidean;
  let epsilon = 0.0001;

  nn_2opt.distance = function (x) {
    if (!arguments.length) {
      return distance;
    }
    distance = x;
    distanceMatrix = null;
    return nn_2opt;
  };

  nn_2opt.distance_matrix = function (x) {
    if (!arguments.length) {
      return distanceMatrix;
    }
    // copy
    distanceMatrix = x.map((y) => y.slice(0));
    return nn_2opt;
  };

  function nn_2opt(matrix) {
    if (distanceMatrix === null) {
      distanceMatrix = dist().distance(distance)(matrix);
    }
    let lowest_dist_all = Number.MAX_VALUE;
    let best_order_all = [];
    
    // Try each row as the initial permutation for NN-2OPT
    for (let s = 0; s < distanceMatrix.length; s++) {
      let order = [];
      order.push(s);
      // NN
      while (order.length < distanceMatrix.length) {
        let nearest = -1;
        for (let i = 0; i < distanceMatrix.length; i++) {
          if (!order.includes(i)) {
            let last = order[order.length - 1];
            if (nearest === -1) {
              nearest = i;
            } else if (
              distanceMatrix[last][i] < distanceMatrix[last][nearest]
            ) {
              nearest = i;
            }
          }
        }
        order.push(nearest);
      }
      let newdist = getTotal(order);
      let olddist = newdist - (epsilon + 1);
      // 2-OPT
      let lowest_dist_2opt = Number.MAX_VALUE;
      let best_order_2opt = [];
      while (newdist - olddist > epsilon) {
        for (let i = 0; i < order.length; i++) {
          for (let j = i + 2; j < order.length - 1; j++) {
            // edge 1: (i,i+1) edge2: (j,j+1)
            let currentd = distanceMatrix[order[i]][order[i + 1]] + distanceMatrix[order[j]][order[j + 1]];
            let candidated = distanceMatrix[order[i]][order[j]] + distanceMatrix[order[i + 1]][order[j + 1]];
            if (candidated < currentd) {               
              let check = [];
              for (let k = 0; k < order.length; k++) {
                check[k] = order[k];
              }
              // Reverse i+1 to j
              for (let k = 0; k <= j - (i + 1); k++) {
                check[i + 1 + k] = order[j - k];
              }
              order = check;
            }
          }
        }
        olddist = newdist;
        newdist = getTotal(order);
        if (newdist < lowest_dist_2opt) {
          lowest_dist_2opt = newdist;
          best_order_2opt = order;
        }
      }
      if (lowest_dist_2opt < lowest_dist_all) {
          lowest_dist_all = lowest_dist_2opt;
          best_order_all = best_order_2opt;
        }
    }
    return best_order_all;
  }

  function getTotal(order) {
    let sum = 0;
    for (let i = 0; i < order.length - 1; i++) {
      sum += distanceMatrix[order[i]][order[i + 1]];
    }
    return sum;
  }

  nn_2opt.distance = function (x) {
    if (!arguments.length) {
      return distance;
    }
    distance = x;
    distanceMatrix = null;
    return nn_2opt;
  };

  nn_2opt.distanceMatrix = nn_2opt.distance_matrix; // compatability

  return nn_2opt;
}
