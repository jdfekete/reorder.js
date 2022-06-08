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
    let lowest_dist = -1;
    let best_order = [];
    // Try each row as the initial permutation
    for (let s = 0; s < distanceMatrix.length; s++) {
      let initial = s;
      let order = [];
      order.push(initial);
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
      let oldm = 0;
      let newm = getTotal(order);
      // 2-OPT
      while (newm - oldm > epsilon) {
        for (let i = 0; i < order.length; i++) {
          for (let j = i + 2; j < order.length - 1; j++) {
            // edge 1: (i,i+1) edge2: (j,j+1)
            let olddist = distanceMatrix[i][i + 1] + distanceMatrix[j][j + 1];
            let newdist = distanceMatrix[i][j] + distanceMatrix[i + 1][j + 1];
            if (newdist < olddist) {
              let check = [];
              for (let k = 0; k < order.length; k++) {
                check[k] = order[k];
              }
              // Reverse i+1 to j
              for (let k = 0; k < j - (i + 1); k++) {
                // TODO: check indices
                check[i + 1 + k] = order[j - k];
              }
              order = check;
            }
          }
        }
        oldm = newm;
        newm = getTotal(order);
        if (newm > lowest_dist) {
          lowest_dist = newm;
          best_order = order;
        }
      }
    }
    return best_order;
  }

  function getTotal(order) {
    let sum = 0;
    for (let i = 0; i < order.length - 1; i++) {
      sum += distanceMatrix[i][i + 1];
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

  return nn_2opt;
}
