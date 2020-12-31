Queue = require('tiny-queue');
var reorder = require('../dist/reorder.cjs');

var vows = require('vows'),
  assert = require('assert');

var suite = vows.describe('reorder.cuthill_mckee');

function Pair(a, b) {
  return { source: a, target: b };
}

suite.addBatch({
  cuthill_mckee: {
    simple: function () {
      var mat = [
        [1, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 0, 1],
        [0, 1, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0, 1],
      ];
      //reorder.displaymat(mat);
      var graph = reorder.mat2graph(mat);
      var components = graph.components();
      assert.equal(components.length, 2);
      assert.equal(reorder.bandwidth(graph), 6);
      var order = reorder.reverse_cuthill_mckee_order(graph);
      //reorder.displaymat(mat, order, order);
      assert.deepEqual(order, [7, 5, 1, 2, 4, 0, 6, 3]);
      assert.equal(reorder.bandwidth(graph, order), 2);
    },
    boost: function () {
      var graph = reorder
        .graph()
        .generate_nodes(10)
        .links([
          Pair(0, 3), //a-d
          Pair(0, 5), //a-f
          Pair(1, 2), //b-c
          Pair(1, 4), //b-e
          Pair(1, 6), //b-g
          Pair(1, 9), //b-j
          Pair(2, 3), //c-d
          Pair(2, 4), //c-e
          Pair(3, 5), //d-f
          Pair(3, 8), //d-i
          Pair(4, 6), //e-g
          Pair(5, 6), //f-g
          Pair(5, 7), //f-h
          Pair(6, 7),
        ]) //g-h
        .init();
      var components = graph.components();
      assert.equal(components.length, 1);
      assert.equal(reorder.bandwidth(graph), 8);
      var order = reorder.reverse_cuthill_mckee_order(graph);
      // Boost returns anoter order with the same bandwidth
      //assert.deepEqual(order, [0, 8, 5, 7, 3, 6, 4, 2, 1, 9]);
      assert.equal(reorder.bandwidth(graph, order), 4);
    },
    harder: function () {
      for (var i = 10; i < 100; i += 20) {
        var mat = reorder.random_matrix(0.2, i),
          graph = reorder.mat2graph(mat),
          bw = reorder.bandwidth(graph),
          order = reorder.reverse_cuthill_mckee_order(graph);
        assert.lesser(reorder.bandwidth(graph, order), bw);
      }
    },
  },
});

suite.export(module);
