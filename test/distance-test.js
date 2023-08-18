const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.distance');

suite.addBatch({
  distance: {
    simple() {
      const a = [3, 0];
      const b = [0, 4];
      assert.equal(reorder.distance.euclidean(a, b), 5);
    },
  },
  manhattan: {
    simple() {
      const a = [3, 0];
      const b = [0, 4];
      assert.equal(reorder.distance.manhattan(a, b), 7);
    },
  },
  minkowski: {
    simple() {
      const a = [3, 0];
      const b = [0, 4];
      assert.equal(reorder.distance.minkowski(1)(a, b), 7);
      assert.equal(reorder.distance.minkowski(2)(a, b), 5);
    },
  },
  chebyshev: {
    simple() {
      const a = [3, 0];
      const b = [0, 4];
      assert.equal(reorder.distance.chebyshev(a, b), 4);
    },
  },
  hamming: {
    simple() {
      const a = [3, 0, 2];
      const b = [0, 4, 2];
      assert.equal(reorder.distance.jaccard(a, b), 1 / 3);
    },
  },
  braycurtis: {
    simple() {
      const a = [1, 0, 1];
      const b = [0, 1, 0];
      assert.equal(reorder.distance.braycurtis(a, b), 1);
    },
  },
  morans: {
    simple() {
      const mat = [
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [1, 0, 1, 0],
        [0, 1, 0, 1],
      ];
      const dist = reorder.distance.morans(mat);
      // TODO
    },
  },
});

suite.export(module);
