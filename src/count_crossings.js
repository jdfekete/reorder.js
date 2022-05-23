import { permutation, inverse_permutation } from './permutation';
import { cmp_number } from './utils';
import { zeroes } from './aliases';

// Wilhelm Barth, Petra Mutzel, Michael Jünger:
// Simple and Efficient Bilayer Cross Counting.
// J. Graph Algorithms Appl. 8(2): 179-194 (2004)
/*jshint loopfunc:true */
export function count_crossings(graph, north, south) {
  const comp = permutation(graph.nodes().length);

  if (north === undefined) {
    north = comp.filter((n) => graph.outDegree(n) !== 0);
    south = comp.filter((n) => graph.inDegree(n) !== 0);
  }

  // Choose the smaller axis
  let invert = false;
  if (north.length < south.length) {
    const tmp = north;
    north = south;
    south = tmp;
    invert = true;
  }

  const south_inv = inverse_permutation(south);
  let southsequence = [];

  for (let i = 0; i < north.length; i++) {
    const n = invert
      ? graph.inEdges(north[i]).map((e) => south_inv[e.target.index])
      : graph.outEdges(north[i]).map((e) => south_inv[e.source.index]);
    n.sort(cmp_number);
    southsequence = southsequence.concat(n);
  }

  let firstIndex = 1;
  while (firstIndex < south.length) {
    firstIndex <<= 1;
  }

  const treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;
  const tree = zeroes(treeSize);

  let crosscount = 0;
  for (let i = 0; i < southsequence.length; i++) {
    let index = southsequence[i] + firstIndex;
    tree[index]++;
    while (index > 0) {
      if (index % 2) {
        crosscount += tree[index + 1];
      }
      index = (index - 1) >> 1;
      tree[index]++;
    }
  }
  return crosscount;
}