const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.mult_barycenter');

function dotest(mats) {
  const graphs = mats.map((x) => reorder.mat2graph(x, true));
  //reorder.displaymat(mat);
  const initial_crossings = reorder.count_all_crossings(graphs);
  const perms = reorder.mult_barycenter_order(graphs);
  // console.log('VOrder: %j, HOrder: %j, Crossings: %d',
  // 		perms[1], perms[0], perms[2]);
  // reorder.displaymat(mat, perms[1], perms[0]);
  assert.isTrue(initial_crossings > perms[2]);
  const perms2 = reorder.mult_adjacent_exchange(graphs, perms[0], perms[1]);
  if (perms2[2]) {
    //reorder.displaymat(mat, perms2[1], perms2[0]);
    const crossings = reorder.count_all_crossings(graphs, perms2[0], perms2[1]);
    assert.equal(crossings, perms[2] - perms2[2]);
    // console.log('final crossings: %d, improved by %d (%d%) %d',
    // 	    crossings, perms[2]-crossings,
    // 	    Math.round((perms[2]-crossings)*100.0/perms[2]),
    // 	   perms2[2]);
    // console.log('VOrder: %j, HOrder: %j', perms2[1], perms2[0]);
    assert.isTrue(crossings < perms[2]);
  }
}

suite.addBatch({
  mult_barycenter: {
    simple() {
      const mat = [
        [0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1],
        [0, 1, 0, 1, 1],
        [1, 1, 1, 0, 0],
      ];
      
      const mat2 = [
        [0, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 1, 0, 1],
      ];
      
      dotest([mat,mat2]);
    },
    hard() {
      for (let i = 10; i < 100; i += 20) {
        for (let j = 10; j < 100; j += 20) {
          const mat = reorder.random_matrix(0.2, i, j, false);
          const mat2 = reorder.random_matrix(0.2, i, j, false);
          dotest([mat,mat2]);
        }
      }
    },
  },
});

suite.export(module);
