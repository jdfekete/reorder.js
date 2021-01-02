import { zeroes } from './aliases';

export function graph2mat(graph, directed) {
  const nodes = graph.nodes();
  const links = graph.links();
  const n = nodes.length;
  let mat;

  if (!directed) {
    directed = graph.directed();
  }
  if (directed) {
    let rows = n;
    let cols = n;

    for (let i = n - 1; i >= 0; i--) {
      if (graph.inEdges(i).length !== 0) {
        break;
      } else {
        rows--;
      }
    }
    for (let i = n - 1; i >= 0; i--) {
      if (graph.outEdges(i).length !== 0) {
        break;
      } else {
        cols--;
      }
    }
    //console.log("Rows: "+rows+" Cols: "+cols);
    mat = zeroes(rows, cols);

    for (let i = 0; i < links.length; i++) {
      const l = links[i];
      mat[l.source.index][l.target.index] = l.value ? l.value : 1;
    }
  } else {
    mat = zeroes(n, n);

    for (let i = 0; i < links.length; i++) {
      const l = links[i];
      mat[l.source.index][l.target.index] = l.value ? l.value : 1;
      mat[l.target.index][l.source.index] = l.value ? l.value : 1;
    }
  }

  return mat;
}
