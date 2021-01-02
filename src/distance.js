function isNum(a, b) {
  return !(isNaN(a) || isNaN(b) || a == Infinity || b == Infinity);
}
export const distance = {
  euclidean(a, b) {
    let s = 0;
    for (let i = a.length; i > 0; i--) {
      if (isNum(a[i], b[i])) {
        const x = a[i] - b[i];
        s += x * x;
      }
    }
    return Math.sqrt(s);
  },
  manhattan(a, b) {
    let s = 0;
    for (let i = a.length; i > 0; i--) {
      if (isNum(a[i], b[i])) {
        s += Math.abs(a[i] - b[i]);
      }
    }
    return s;
  },
  minkowski(p) {
    return (a, b) => {
      let s = 0;
      for (let i = a.length; i > 0; i--) {
        if (isNum(a[i], b[i])) {
          s += Math.pow(Math.abs(a[i] - b[i]), p);
        }
      }
      return Math.pow(s, 1 / p);
    };
  },
  chebyshev(a, b) {
    let max = 0;
    for (let i = a.length; i > 0; i--) {
      if (isNum(a[i], b[i])) {
        const x = Math.abs(a[i] - b[i]);
        if (x > max) max = x;
      }
    }
    return max;
  },
  hamming(a, b) {
    let d = 0;
    for (let i = a.length; i > 0; i--) {
      if (isNum(a[i], b[i])) {
        if (a[i] !== b[i]) d++;
      }
    }
    return d;
  },
  jaccard(a, b) {
    let n = 0;
    let s = 0;
    for (let i = a.length; i > 0; i--) {
      if (isNum(a[i], b[i])) {
        if (a[i] === b[i]) s++;
        n++;
      }
    }
    if (n === 0) return 0;
    return s / n;
  },
  braycurtis(a, b) {
    let s0 = 0;
    let s1 = 0;
    for (let i = a.length; i > 0; i--) {
      const ai = a[i];
      const bi = b[i];
      if (isNum(ai, bi)) {
        s0 += Math.abs(ai - bi);
        s1 += Math.abs(ai + bi);
      }
    }
    if (s1 === 0) return 0;
    return s0 / s1;
  },
};
