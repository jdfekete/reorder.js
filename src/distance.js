function isNum(a, b) {
  return !(isNaN(a) || isNaN(b) || a == Infinity || b == Infinity);
}
export const distance = {};

distance.euclidean = function (a, b) {
  let s = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    if (isNum(a[i], b[i])) {
      const x = a[i] - b[i];
      s += x * x;
    }
  }
  return Math.sqrt(s);
};

distance.manhattan = function (a, b) {
  let s = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    if (isNum(a[i], b[i])) {
      s += Math.abs(a[i] - b[i]);
    }
  }
  return s;
};

distance.minkowski = function (p) {
  return (a, b) => {
    let s = 0;
    for (let i = a.length - 1; i >= 0; i--) {
      if (isNum(a[i], b[i])) {
        s += Math.pow(Math.abs(a[i] - b[i]), p);
      }
    }
    return Math.pow(s, 1 / p);
  };
};

distance.chebyshev = function (a, b) {
  let max = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    if (isNum(a[i], b[i])) {
      const x = Math.abs(a[i] - b[i]);
      if (x > max) {
        max = x;
      }
    }
  }
  return max;
};

distance.hamming = function (a, b) {
  let d = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    if (isNum(a[i], b[i])) {
      if (a[i] !== b[i]) {
        d++;
      }
    }
  }
  return d;
};

distance.jaccard = function (a, b) {
  let n = 0;
  let s = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    if (isNum(a[i], b[i])) {
      if (a[i] === b[i]) {
        s++;
      }
      n++;
    }
  }
  if (n === 0) {
    return 0;
  }
  return s / n;
};

distance.braycurtis = function (a, b) {
  let s0 = 0;
  let s1 = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    const ai = a[i];
    const bi = b[i];
    if (isNum(ai, bi)) {
      s0 += Math.abs(ai - bi);
      s1 += Math.abs(ai + bi);
    }
  }
  if (s1 === 0) {
    return 0;
  }
  return s0 / s1;
};

// A distance measure based on Moran's I
// Note that this distance can be both negative (similar) and positive (not similar, the higher the distance, the less similar a and b)
//
// N. van Beusekom, W. Meulemans, B. Speckmann, Simultaneous Orderings for Graph Collections
// IEEE Transactions on Visualization and Computer Graphics, vol. 28, no. 1, pp. 1-10, Jan. 2022
distance.morans = function (matrix) {
  let m = 0;
  const n = matrix.length * matrix[0].length;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      m += matrix[i][j];
    }
  }
  return (a, b) => {
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      if (isNum(a[i], b[i])) {
        result += (a[i] * n - m) * (b[i] * n - m);
      }
    }
    return -1 * result;
  };
};
