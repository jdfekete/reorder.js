const reorder = require('../dist/reorder.cjs');

const vows = require('vows'),
  assert = require('assert');
const seedrandom = require('seedrandom');
Math.seedrandom('reorder');

const suite = vows.describe('reorder.graph2mat');

function remove_zeroes(mat) {
  let i, j;
  for (i = mat.length - 1; i >= 0; i--) {
    const row = mat[i];
    if (row.some((a) => a > 0)) {
      //console.log('remove row %d', i);
      break;
    }
    mat.pop();
  }
  for (j = mat[0].length - 1; j >= 0; j--) {
    if (mat.some((row) => row[j] != 0)) {
      //console.log('remove column %d', j);
      break;
    }
    for (i = 0; i < mat.length; i++) mat[i].pop();
  }

  return mat;
}

suite.addBatch({
  graph2mat: {
    simple() {
      const mat = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];
      const graph = reorder.mat2graph(mat);
      assert.equal(graph.nodes().length, 3);
      assert.equal(graph.links().length, 2);
      const m2 = reorder.graph2mat(graph);
      assert.deepEqual(m2, mat);
    },
    lesssimple() {
      const mat = reorder.random_matrix(0.2, 10),
        graph = reorder.mat2graph(mat),
        m2 = reorder.graph2mat(graph);
      assert.deepEqual(m2, mat);
    },
    hard() {
      for (let i = 10; i < 100; i += 20) {
        for (let j = 10; j < 100; j += 20) {
          const mat = remove_zeroes(reorder.random_matrix(0.2, i, j, false)),
            graph = reorder.mat2graph(mat, true),
            m2 = reorder.graph2mat(graph);
          assert.deepEqual(m2, mat);
        }
      }
    },
  },
});

suite.export(module);
