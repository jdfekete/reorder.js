const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.all-pairs-distance');

function dotest(graph) {
  const mat = reorder.all_pairs_distance(graph);
  const bfs = reorder.all_pairs_distance_bfs(graph);
  //const n = graph.nodes().length;

  assert.equal(mat.length, 1); // 1 component
  assert.deepEqual(mat[0], bfs);

  // var dn = reorder.floyd_warshall_with_path(graph),
  // 	dist = dn[0],
  // 	next = dn[1];
  // assert.deepEqual(mat[0], dist);
  // for (var i = 0; i < n-1; i++) {
  // 	for (var j = i+1; j < n; j++) {
  // 	    assert.equal(dist[i][j],
  // 			 reorder.floyd_warshall_path(next, i, j).length-1);
  // 	}
  // }
  return mat;
}

suite.addBatch({
  all_pairs_distance: {
    simple() {
      const nodes = [{ id: 0 }, { id: 1 }, { id: 2 }];
      const links = [
        { source: 0, target: 1 },
        { source: 1, target: 2 },
      ];
      const graph = reorder.graph(nodes, links).init();
      const mat = dotest(graph);

      assert.equal(mat[0].length, 3);
      assert.deepEqual(mat[0], [
        [0, 1, 2],
        [1, 0, 1],
        [2, 1, 0],
      ]);
    },
    hard() {
      // compare results with Dijkstra distances
      // from a random node.
      for (let i = 10; i < 100; i++) {
        const graph = reorder.graph_connect(reorder.graph_random(i, 0.2));
        dotest(graph);
      }
    },
  },
});

suite.export(module);
