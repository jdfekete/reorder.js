const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');

const suite = vows.describe('reorder.pcp');

suite.addBatch({
  pcp: {
    simple() {
      const earray = [
        [0, 1, 2],
        [3, 4, 5],
      ];
      const dicts = reorder.array_to_dicts(earray);
      assert.equal(dicts.length, earray.length);
      const array = reorder.dicts_to_array(dicts);
      assert.deepEqual(earray, array);
    },
  },
});

suite.export(module);
