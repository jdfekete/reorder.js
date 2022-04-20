const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.union');

suite.addBatch({
  union: {
    simple() {
      const mats = [[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,1,1],
        [0,0,1,1]
      ],
      [
        [0,0,0,0],
        [0,0,0,0],
        [1,1,1,1],
        [1,1,1,1]
      ],
      [
        [0,0,1,1],
        [0,0,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ],
      [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
      ]];
      const result = [
          [1,1,2,2],
          [1,1,2,2],
          [3,3,4,4],
          [3,3,4,4]
      ];

      assert.deepequal(reorder.union(mats), result);
    },
  },
});

suite.export(module);
