const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');
const seedrandom = require('seedrandom');
Math.seedrandom('reorder');

const suite = vows.describe('reorder.graph2distmat');

suite.addBatch({
  graph2distmat: {
    simple() {
      const mat = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];
      const dist = [
        [0, 1, 2],
        [1, 0, 1],
        [2, 1, 0],
      ];
      const graph = reorder.mat2graph(mat);
      assert.equal(graph.nodes().length, 3);
      assert.equal(graph.links().length, 2);
      const dists = reorder.all_pairs_distance(graph);
      assert.deepEqual(dists[0], dist);
      const valuemat = reorder.distmat2valuemat(dist);
      assert.deepEqual(valuemat, [
        [3, 2, 1],
        [2, 3, 2],
        [1, 2, 3],
      ]);
      // var max_link = graph.links().reduce(
      // 	function(a, b) {
      // 	    return a.value > b.value ? a : b;
      // 	}),
      // 	max_value = max_link ? max_link.value : 0;
      // var links = graph.links()
      // 	    .map(function(l) {
      // 		return {
      // 		    value: (max_value - l.value)/max_value,
      // 		    source: l.source.index,
      // 		    target: l.target.index
      // 		};
      // 	    });
      // console.log(links);
    },
  },
});

suite.export(module);
