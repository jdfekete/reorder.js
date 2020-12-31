const reorder = require('../dist/reorder.cjs');

const vows = require('vows'),
  assert = require('assert');

const suite = vows.describe('reorder.mat2graph');

suite.addBatch({
  mat2graph: {
    simple() {
      const mat = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];
      const graph = reorder.mat2graph(mat);
      assert.equal(graph.nodes().length, 3);
      assert.equal(graph.links().length, 2);
    },
    lesssimple() {
      const mat = [
        [0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1],
        [0, 1, 0, 1, 1],
        [1, 1, 1, 0, 0],
      ];
      const graph = reorder.mat2graph(mat, true); // directed graph
      assert.equal(graph.nodes().length, 5);
      assert.equal(graph.links().length, 11);
      const m2 = reorder.graph2mat(graph);
      assert.deepEqual(m2, mat);
    },
  },
});

suite.export(module);
