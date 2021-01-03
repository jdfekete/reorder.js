const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');
require('seedrandom');
require('./env-assert');

Math.seedrandom('reorder');

const suite = vows.describe('reorder.ca');

// function compare_order(row_order1, row_order2, msg) {
//   const tmp = Array(row_order1.length);
//   assert.equal(row_order1.length, row_order2.length);
//   for (let i = 0; i < row_order1.length; i++) {
//     if (Math.abs(row_order2) < 1e-9) tmp[i] = NaN;
//     else tmp[i] = row_order1[i] / row_order2[i];
//   }
//   reorder.printvec(tmp, 2, null, msg);
// }

suite.addBatch({
  ca: {
    simple() {
      // Ground truth with R, package "ca":
      // library(ca)
      // res=ca(mat)
      // erows = res$rowcoord[,1]
      // ecols = res$colcoord[,1]
      const mat = [
        [1, 0, 0, 1, 1, 0, 0, 1],
        [0, 1, 1, 0, 0, 1, 0, 1],
        [1, 1, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 0, 0, 1],
        [1, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0],
      ];
      const res = reorder.ca_order(mat);
      const row_order = res.rows;
      const col_order = res.cols;
      const erows = reorder.sort_order([
        -1.044914,
        0.97013,
        1.675125,
        -0.439146,
        -0.321923,
        -1.239397,
      ]);
      const ecols = reorder.sort_order([
        -0.396887,
        0.68218,
        0.384491,
        -0.871822,
        -1.314724,
        1.915459,
        2.425954,
        -0.302626,
      ]);

      assert.permutationEqual(row_order, erows);
      assert.permutationEqual(col_order, ecols);
    },
    // "harder": function() {
    //     var mat = [
    // 	[1, 0, 0, 1, 0],
    // 	[0, 1, 1, 0, 1],
    // 	[1, 0, 0, 1, 0],
    // 	[1, 1, 0, 0, 0],
    // 	[0, 1, 1, 0, 1]
    //     ],
    // 	res = reorder.ca_order(mat),
    // 	col_order = res.cols,
    // 	row_order = res.rows;
    //     console.log('col_order: '+col_order);
    //     console.log('row_order: '+row_order);
    //     reorder.displaymat(mat);
    //     reorder.displaymat(mat, col_order, row_order);
    // },
    // "bertin": function() {
    //     var mat = [
    // 	[6, 6, 2, 5, 3],
    // 	[32, 6, 5, 45, 15],
    // 	[37, 61, 69, 29, 59],
    // 	[16, 23, 21, 9, 14],
    // 	[9, 4, 3, 12, 9]
    //     ],
    // 	res = reorder.ca(mat),
    // 	col_order = reorder.sort_order(res[0]),
    // 	row_order = reorder.sort_order(res[1]);
    //     console.log('col_order: '+col_order);
    //     console.log('row_order: '+row_order);
    //     reorder.printmat(mat);
    //     reorder.printmat(mat, col_order, row_order);
    // },
    harder() {
      const mat = [
        [45, 126, 24, 5],
        [87, 93, 19, 1],
        [0, 0, 52, 148],
        [36, 68, 74, 22],
        [0, 30, 111, 59],
      ];
      const res = reorder.ca_order(mat);
      const col_order = res.cols;
      const row_order = res.rows;
      const erows = reorder.sort_order([
        -0.928335,
        -1.1010641,
        1.5381971,
        -0.2229937,
        0.7141957,
      ]);
      const ecols = reorder.sort_order([
        -1.127688,
        -0.8747596,
        0.4626773,
        1.4348968,
      ]);

      assert.permutationEqual(row_order, erows);
      assert.permutationEqual(col_order, ecols);
      // console.log('col_order: '+col_order);
      // console.log('row_order: '+row_order);
      // reorder.printmat(mat);
      // reorder.printmat(mat, col_order, row_order);
    },
  },
});

suite.export(module);
