const reorder = require('../dist/reorder.cjs');

const vows = require('vows'),
  assert = require('assert');

const suite = vows.describe('reorder.permute');

suite.addBatch({
  permute: {
    simple1() {
      assert.deepEqual(reorder.permute([0], [0]), [0]);
    },
    simple2() {
      assert.deepEqual(reorder.permute([0, 1], [0, 1]), [0, 1]);
    },
    simple3() {
      assert.deepEqual(reorder.permute([1, 0], [0, 1]), [1, 0]);
    },
    simple4() {
      assert.deepEqual(reorder.permute([0, 1], [1, 0]), [1, 0]);
    },
    simple5() {
      assert.deepEqual(reorder.permute([0, 1, 2], [1, 2, 0]), [1, 2, 0]);
    },
    harder() {
      for (let i = 10; i <= 100; i += 10) {
        const list = reorder.permutation(i),
          perm = reorder.randomPermute(list.slice());

        assert.deepEqual(perm, reorder.permute(list, perm));
      }
    },
    hard() {
      for (let i = 10; i <= 100; i++) {
        const list = reorder.permutation(i),
          perm = reorder.randomPermute(list.slice()),
          permc = perm.slice(),
          inv = reorder.inverse_permutation(perm, true);

        assert.deepEqual(list, reorder.permute(inv.slice(), perm));
        assert.deepEqual(perm, permc);
        assert.deepEqual(list, reorder.permute(perm.slice(), inv));
      }
    },
  },
});

suite.export(module);
