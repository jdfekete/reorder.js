import { permutation, inverse_permutation } from './permutation';
import { cmp_number } from './utils';
import { zeroes } from './aliases';

// Wilhelm Barth, Petra Mutzel, Michael Jünger:
// Simple and Efficient Bilayer Cross Counting.
// J. Graph Algorithms Appl. 8(2): 179-194 (2004)
/*jshint loopfunc:true */
export function count_crossings(graph, north, south) {
  let i,
    j,
    n,
    firstIndex,
    treeSize,
    tree,
    index,
    weightSum,
    invert = false,
    crosscount;

  const comp = permutation(graph.nodes().length);

  if (north === undefined) {
    north = comp.filter((n) => {
      return graph.outDegree(n) !== 0;
    });
    south = comp.filter((n) => {
      return graph.inDegree(n) !== 0;
    });
  }

  // Choose the smaller axis
  if (north.length < south.length) {
    const tmp = north;
    north = south;
    south = tmp;
    invert = true;
  }

  const south_inv = inverse_permutation(south);
  let southsequence = [];

  for (i = 0; i < north.length; i++) {
    if (invert) {
      n = graph.inEdges(north[i]).map((e) => {
        return south_inv[e.target.index];
      });
    } else {
      n = graph.outEdges(north[i]).map((e) => {
        return south_inv[e.source.index];
      });
    }
    n.sort(cmp_number);
    southsequence = southsequence.concat(n);
  }

  firstIndex = 1;
  while (firstIndex < south.length) firstIndex <<= 1;
  treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;
  tree = zeroes(treeSize);

  crosscount = 0;
  for (i = 0; i < southsequence.length; i++) {
    index = southsequence[i] + firstIndex;
    tree[index]++;
    while (index > 0) {
      if (index % 2) crosscount += tree[index + 1];
      index = (index - 1) >> 1;
      tree[index]++;
    }
  }
  return crosscount;
}
