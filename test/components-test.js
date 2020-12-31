const reorder = require('../dist/reorder.cjs');

const vows = require('vows'),
  assert = require('assert');

const suite = vows.describe('reorder.components');

suite.addBatch({
  components: {
    simple() {
      const nodes = [{ id: 0 }, { id: 1 }, { id: 2 }],
        links = [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
        ];
      const graph = reorder.graph().nodes(nodes).links(links).init();

      const components = graph.components();
      assert.equal(components.length, 1);
      assert.equal(components[0].length, 3);
    },
    lesssimple() {
      const nodes = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        links = [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
          { source: 3, target: 4 },
        ];
      const graph = reorder.graph().nodes(nodes).links(links).init();

      const components = graph.components();
      assert.equal(components.length, 2);
      assert.equal(components[0].length, 3);
      assert.equal(components[1].length, 2);
    },
  },
});

suite.export(module);
