const reorder = require('../dist/reorder.cjs');

const vows = require('vows'),
  assert = require('assert');

const suite = vows.describe('reorder.optimal_leaf_order');

function eucl(a, b) {
  const x = b - a;
  return x * x;
}

function remove_equal_dist(dm) {
  const values = {};

  for (let i = 0; i < dm.length; i++) {
    const row = dm[i];
    for (let j = i + 1; j < dm.length; j++) {
      let v = row[j];
      if (values[v]) {
        console.log(`Duplicate dist ${v} at [${i},${j}]`);
        v += Math.random() / 1000;
        row[j] = v;
        dm[j][i] = v;
      }
      values[v] = true;
    }
  }
}

function clusterEqual(h1, h2) {
  //console.log(h1);
  //console.log(h2);
  if (h1 == h2) return true;
  return (
    h1.dist == h2.dist &&
    h1.size == h2.size &&
    h1.depth == h2.depth &&
    ((clusterEqual(h1.left, h2.left) && clusterEqual(h1.right, h2.right)) ||
      (clusterEqual(h1.left, h2.right) && clusterEqual(h1.right, h2.left)))
  );
}

suite.addBatch({
  leaforder: {
    simple() {
      const data = [2, 1, 4, 3];
      const expect = [1, 2, 3, 4];
      let x = reorder.optimal_leaf_order().distance(eucl)(data);
      assert.deepEqual(reorder.stablepermute(data, x), expect);

      x = reorder.optimal_leaf_order()(expect);
      assert.deepEqual(reorder.stablepermute(expect, x), expect);
    },
    lesssimple() {
      let prev = 0;
      const data = [prev];
      let next;
      for (let i = 0; i < 30; i++) {
        next = Math.random() + prev;
        data.push(next);
        prev = next;
      }
      const randata = reorder.randomPermute(data.slice());
      const x = reorder.optimal_leaf_order().distance(eucl)(randata);
      assert.deepEqual(reorder.stablepermute(randata.slice(), x), data);
    },
    evenharder() {
      const rows = 30;
      const cols = 20;
      const array = [];

      for (let i = 0; i < rows; i++) {
        const row = [];
        array.push(row);
        for (let j = 0; j < cols; j++) {
          row.push(Math.random());
        }
      }
      const order = reorder.optimal_leaf_order();
      let perm = order(array);
      // Check determinism
      for (let i = 0; i < 3; i++) {
        const p2 = order(array);
        assert.deepEqual(perm, p2);
      }
      // Disambiguate distance matrix to have a
      // deterministic hcluster
      let dm = reorder.dist()(array);

      remove_equal_dist(dm);
      //reorder.printmat(dm);
      const h1 = reorder.hcluster().linkage('complete').distanceMatrix(dm)(
        array
      );

      perm = reorder.optimal_leaf_order().distanceMatrix(dm)(array);
      const a2 = reorder.permute(array, perm);
      const d2 = reorder.dist()(a2);
      dm = reorder.permute(dm, perm);
      dm = reorder.permutetranspose(dm, perm);

      assert.deepEqual(d2, dm);

      const h2 = reorder.hcluster().linkage('complete').distanceMatrix(d2)(a2);

      assert.isTrue(clusterEqual(h1, h2), 'Clusters are not equal');

      const p3 = order.distanceMatrix(d2)(a2);

      assert.deepEqual(p3, reorder.range(0, p3.length));
    },
  },
});

suite.export(module);
