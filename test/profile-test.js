const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.profile');

suite.addBatch({
  profile: {
    simple() {
      const mat1 = [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ];
      const mat2 = [
          [1,0,0,1],
          [0,1,0,0],
          [1,0,1,0],
          [1,0,0,1]
      ];

      assert.equal(reorder.profile(mat1), 3);
      assert.equal(reorder.profile(mat2), 6);
    },
  },
});

suite.export(module);
