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
      ? graph.inEdges(north[i]).map((e) => [south_inv[e.target.index],e.value])
      : graph.outEdges(north[i]).map((e) => [south_inv[e.source.index],e.value]);
    n.sort(cmp_number);
    southsequence = southsequence.concat(n);
  }

  // Insertion sort method
  let crosscount = 0;
    for (var i = 1; i < southsequence.length; i++) {
        let key = southsequence[i];
        let j = i - 1;
        while (j >= 0 && southsequence[j][0] > key[0]) {
            southsequence[j + 1] = southsequence[j];
            crosscount += key[1] * southsequence[j][1];
            j = j - 1;
        }
        southsequence[j + 1] = key;
    }
  return crosscount;
}