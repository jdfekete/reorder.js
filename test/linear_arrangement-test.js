const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.linear_arrangement');

suite.addBatch({
  linear_arrangement: {
    simple() {
      const mat1 = [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ];
      const mat2 = [
        [1, 0, 0, 1],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 0, 1],
      ];

      assert.equal(reorder.linear_arrangement(mat1), 20);
      assert.equal(reorder.linear_arrangement(mat2), 6);
    },
  },
});

suite.export(module);
