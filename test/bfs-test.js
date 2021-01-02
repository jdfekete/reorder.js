const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.bfs');

suite.addBatch({
  all_pairs_distance: {
    simple() {
      const nodes = [{ id: 0 }, { id: 1 }, { id: 2 }];
      const links = [
        { source: 0, target: 1 },
        { source: 1, target: 2 },
      ];
      const graph = reorder.graph(nodes, links).init();
      const dist = reorder.bfs_distances(graph, 0);
      //console.log('Dist: %j', dist);

      assert.equal(Object.keys(dist).length, 3);
      assert.equal(dist[0], 0);
      assert.equal(dist[1], 1);
      assert.equal(dist[2], 2);
    },
  },
});

suite.export(module);
