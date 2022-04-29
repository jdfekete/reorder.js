import { distance as distances } from './distance';
import { dist } from './dist';

export function nn_2opt() {
  let distanceMatrix = null;
  let distance = distances.euclidean;
  
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
    console.log(distance_matrix);
    return nn_2opt;
  };
  
  function nn_2opt(matrix) {
    if (distanceMatrix === null) {
      distanceMatrix = dist().distance(distance)(matrix);
    }
    const cluster = hcluster().linkage(linkage).distanceMatrix(distanceMatrix);
    return orderFull(cluster(matrix));
  }
  optimal_leaf_order.order = orderFull;
  optimal_leaf_order.reorder = optimal_leaf_order;

  optimal_leaf_order.distance = function (x) {
    if (!arguments.length) {
      return distance;
    }
    distance = x;
    distanceMatrix = null;
    return optimal_leaf_order;
  };

  return nn_2opt;
}
