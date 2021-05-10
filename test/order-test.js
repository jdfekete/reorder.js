const reorder = require('../dist/reorder.cjs');
const vows = require('vows');
const assert = require('assert');
const suite = vows.describe('reorder.order');
const seedrandom = require('seedrandom');

seedrandom('reorder');

assert.ORdeepEqual = (actual, expected_list) => {
  for (const expected of expected_list) {
    if (deepEqual(actual, expected)) {
      assert.ok(actual, 'Assert OK');
      return true;
    }
  }

  assert.fail(actual, expected_list, 'Assert: Expectations failed');
  return false;
};

function eucl(a, b) {
  const x = b - a;
  return x * x;
}

function fortytwo(a) {
  return a + 42;
}

function lesssimple() {
  const prefix = reorder.range(0, 10);
  let prev = 10;
  let data = [prev];

  for (let i = 0; i < 30; i++) {
    const next = Math.random() + prev;
    data.push(next);
    prev = next;
  }
  const suffix = reorder.range(Math.ceil(prev + 1), Math.ceil(prev + 21));
  const i = prefix.length;
  const j = i + data.length;
  data = prefix.concat(data).concat(suffix);
  //console.log("Original   : "+data);
  const randata = reorder.randomPermute(data.slice(0), i, j);
  //console.log("Shuffled   : "+randata);
  const x = reorder.order().distance(eucl).limits(i, j)(randata);
  //console.log("Permutation: "+randata);
  assert.deepEqual(reorder.stablepermute(randata, x), data);
}

function insert_simple(v, i, j) {
  const x = reorder.order().distance(eucl).except([i, j])(v);
  assert.deepEqual(
    reorder.stablepermute(v, x),
    reorder.range(42, 42 + v.length)
  );
}

function insert_lesssimple() {
  const plen = Math.round(Math.random() * 20);
  const mlen = Math.round(Math.random() * 20) + 2;
  const slen = Math.round(Math.random() * 20);
  const cut = Math.round(Math.random() * (plen + slen));
  const prefix = reorder.range(42, 42 + plen);
  const middle = reorder.range(42 + plen, 42 + plen + mlen);
  const suffix = reorder.range(42 + plen + mlen, 42 + plen + mlen + slen);
  let shuffled = reorder.randomPermute(prefix.concat(suffix));

  shuffled = shuffled.slice(0, cut).concat(middle).concat(shuffled.slice(cut));
  //console.log("i="+cut+", j="+(cut+middle.length));
  const x = reorder
    .order()
    .distance(eucl)
    .except([cut, cut + middle.length])(shuffled);

  assert.deepEqual(
    reorder.stablepermute(shuffled, x),
    prefix.concat(middle.concat(suffix))
  );
}

suite.addBatch({
  order: {
    simple() {
      const data = [-1, -2, 0, 2, 1, 4, 3, 10, 11, 12];
      const x = reorder.order().distance(eucl).limits(3, 7)(data);
      assert.deepEqual(reorder.stablepermute(data, x), [
        -1,
        -2,
        0,
        1,
        2,
        3,
        4,
        10,
        11,
        12,
      ]);
    },
    lesssimple,
    evenharder() {
      for (let n = 10; n-- > 0; ) {
        lesssimple();
      }
    },
    'equiv-simple': function () {
      const data = [0, 1, 2, 2, 2, 2, 3, 4, 4, 4, 5, 5, 6].map(fortytwo);
      const shuffled = reorder.randomPermute(data.slice(0));

      const x = reorder.order().distance(eucl)(shuffled);
      assert.deepEqual(reorder.stablepermute(shuffled, x), data);
    },
    'equiv-simple2': function () {
      const data = [
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 0, 0],
      ];

      const x = reorder.order().linkage('single')(data);

      assert.deepEqual(
        reorder.stablepermute(reorder.range(0, data.length), x),
        toNum(['a', 'f', 'e', 'd', 'c', 'b'])
      );
    },
    /*
	"equiv-simple3": function() {
	    var data = reorder.transpose([
		[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
		[1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
		[0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
		[0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
		[0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0]
		]);
            
            var x = reorder.order()
		    .linkage("single")(data);
	    console.log(toLetter(x));
            assert.deepEqual(reorder.stablepermute(data, x),
			     toNum(['n','j','a','e','f','i','m','p','b','o','l','g','d','c','k','h']));
	},
*/
    'insert-simple': function () {
      const prefix = [0, 1, 2, 3].map(fortytwo);
      const middle = [4, 5, 6, 7, 8].map(fortytwo);
      const suffix = [9, 10, 11, 12].map(fortytwo);
      let shuffled = reorder.randomPermute(prefix.concat(suffix));

      shuffled = shuffled.slice(0, 5).concat(middle).concat(shuffled.slice(5));

      const x = reorder
        .order()
        .distance(eucl)
        .except([5, 5 + middle.length])(shuffled);

      assert.deepEqual(
        reorder.stablepermute(shuffled, x),
        reorder.range(0, 13).map(fortytwo)
      );
    },
    'insert-1': function () {
      insert_simple(
        [
          74,
          44,
          48,
          72,
          70,
          67,
          46,
          53,
          76,
          52,
          45,
          42,
          49,
          77,
          47,
          68,
          43,
          73,
          51,
          55,
          54,
          69,
          75,
          50,
          56,
          57,
          58,
          59,
          60,
          61,
          62,
          63,
          64,
          65,
          66,
          71,
        ],
        24,
        24 + 11
      );
    },
    'insert-2': function () {
      insert_simple(
        [
          44,
          70,
          69,
          66,
          43,
          71,
          46,
          73,
          67,
          47,
          65,
          68,
          42,
          72,
          50,
          51,
          52,
          53,
          54,
          55,
          56,
          57,
          58,
          59,
          60,
          61,
          62,
          63,
          64,
          48,
          49,
          45,
        ],
        14,
        14 + 15
      );
    },
    'insert-3': function () {
      const data = [
        [1, 1, 0],
        [0, 0, 1],
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ];
      const x = reorder.order().limits(1, 10).except([5, 10])(data);
      // Since several rows are identical, there are multiple
      // possible correct orderings
      assert.ORdeepEqual(x, [
        [0, 3, 2, 5, 6, 7, 8, 9, 4, 1, 10],
        [0, 2, 3, 5, 6, 7, 8, 9, 4, 1, 10],
        [0, 3, 2, 5, 6, 7, 8, 9, 1, 4, 10],
        [0, 2, 3, 5, 6, 7, 8, 9, 1, 4, 10],
      ]);
    },
    'insert-4': function () {
      const data = [
        [1, 1, 0],
        [0, 0, 1],
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ];
      const x = reorder.order().limits(1, 11).except([3, 8])(data);
      // Since several rows are identical, there are multiple
      // possible correct orderings
      assert.deepEqual(x, [0, 8, 2, 3, 4, 5, 6, 7, 10, 1, 9]);
    },
    'insert-5': function () {
      const data = [
        [NaN, NaN, NaN],
        [1, 1, 0],
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
        [1, 1, 0],
        [1, 1, 0],
        [0, 1, 1],
        [1, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
      ];
      reorder.order().limits(1, 12).except([2, 4, 7, 12])(data);
      // const x = reorder.order().limits(1, 12).except([2, 4, 7, 12])(data);
      // Since several rows are identical, there are multiple
      // possible correct orderings
      // assert.deepEqual(x, [0, 8, 2, 3, 4, 5, 6, 7, 10, 1, 9]);
    },
    'insert-6': function () {
      const data = [
        [1, 1, 0],
        [0, 0, 1],
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ];
      reorder.order().limits(1, 11).except([1, 6])(data);
      // const x = reorder.order().limits(1, 11).except([1, 6])(data);
      // Since several rows are identical, there are multiple
      // possible correct orderings
      // assert.deepEqual(x, [0, 8, 2, 3, 4, 5, 6, 7, 10, 1, 9]);
    },
    'insert-7': function () {
      const data = [
        [0, 0, 1],
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ];
      reorder.order().limits(1, 10).except([5, 9])(data);
      // const x = reorder.order().limits(1, 10).except([5, 9])(data);
      // Since several rows are identical, there are multiple
      // possible correct orderings
      // assert.deepEqual(x, [0, 8, 2, 3, 4, 5, 6, 7, 10, 1, 9]);
    },
    'insert-lesssimple': insert_lesssimple,
    'insert-evenharder': () => {
      for (let i = 0; i < 20; i++) {
        //console.log("Loop "+i);
        insert_lesssimple();
      }
    },
  },
});

function deepEqual(actual, expected) {
  if (actual === expected) {
    return true;
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;
  } else {
    return objEquiv(actual, expected);
  }
}

// Taken from node/lib/assert.js
function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

// Taken from node/lib/assert.js
function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

const pSlice = Array.prototype.slice;

// Taken from node/lib/assert.js
function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
    return false;
  }
  if (a.prototype !== b.prototype) {
    return false;
  }
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b);
  }
  let ka;
  let kb;
  try {
    ka = Object.keys(a);
    kb = Object.keys(b);
  } catch (e) {
    return false;
  }
  if (ka.length != kb.length) {
    return false;
  }
  ka.sort();
  kb.sort();
  for (let i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) {
      return false;
    }
  }
  for (let i = ka.length - 1; i >= 0; i--) {
    const key = ka[i];
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

function toNum(a) {
  return a.map((l) => l.charCodeAt(0) - 97);
}

/*
function toLetter(a) {
  return a.map((l) => String.fromCharCode(97 + l));
}
*/

suite.export(module);
