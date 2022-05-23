const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.nn_2opt');

suite.addBatch({
  nn_2opt: {
    simple() {
      const dist = [
        [0,1,2,3],
        [1,0,1,2],
        [2,1,0,1],
        [3,2,1,0]
      ];

      let nn2opt = reorder.nn_2opt();

      assert.deepEqual(nn2opt.distance_matrix(dist)(), [0,1,2,3]);
    },
  },
});

suite.export(module);
