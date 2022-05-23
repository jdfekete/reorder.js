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
      const dist2 = [
        [0,1,3,2],
        [1,0,2,1],
        [3,2,0,1],
        [2,1,1,0]
      ];

      let nn2opt = reorder.nn_2opt();

      console.log("NN 2OPT test")
      console.log(nn2opt.distance_matrix(dist)());

      assert.equal(reorder.morans_i(mat1), 1);
      assert.equal(reorder.morans_i(mat2), -1);
    },
  },
});

suite.export(module);
