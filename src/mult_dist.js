import { distance as distances } from './distance';

/*
 * Distance computation based on multiple matrices (not squared)
 *
 * Simultaneous Matrix Orderings for Graph Collections.
 * Nathan van Beusekom, Wouter Meulemans, and Bettina Speckmann.
 * IEEE Transactions on Visualization and Computer Graphics, 28(1), pp 1-10, 2021.
 * https://arxiv.org/abs/2109.12050
 */
export function mult_dist() {
  let distance = distances.euclidean;

  function mult_dist(matrices, distances) {
    const n = matrices.length;

    const res = [];
    for (let i = 0; i < matrices[0].length; i++) {
      const newrow = [];
      for (let j = 0; j < matrices[0][0].length; j++) {
        newrow.push(0);
      }
      res.push(newrow);
    }
    for (let k = 0; k < n; k++) {
      distance = distances[k];
      let distMatrix = [];
      const vector = matrices[k];
      const n1 = vector.length;
      for (let i = 0; i < n1; i++) {
        const d = [];
        distMatrix[i] = d;
        for (let j = 0; j < n1; j++) {
          if (j < i) {
            d[j] = distMatrix[j][i];
          } else if (i === j) {
            d[j] = 0;
          } else {
            d[j] = distance(vector[i], vector[j]);
          }
        }
      }
      for (let i = 0; i < distMatrix.length; i++) {
        for (let j = 0; j < distMatrix[0].length; j++) {
          res[i][j] += distMatrix[i][j];
        }
      }
    }
    return res;
  }

  mult_dist.distance = function (x) {
    if (!arguments.length) {
      return distance;
    }
    distance = x;
    return mult_dist;
  };

  return mult_dist;
}
