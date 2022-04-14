const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.morans_i');

suite.addBatch({
  morans_i: {
    simple() {
      var mat1 = [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ];
      var mat2 = [
          [1,0,1,0],
          [0,1,0,1],
          [1,0,1,0],
          [0,1,0,1]
      ];

      assert.equal(reorder.morans_i(mat1), 1);
      assert.equal(reorder.morans_i(mat2), -1);
    },
  },
});

suite.export(module);
