import { bfs } from './bfs';

/*jshint loopfunc:true */
export const bfs_order = (graph, comps) => {
  if (!comps) comps = graph.components();

  let i;
  let comp;
  const order = [];

  for (i = 0; i < comps.length; i++) {
    comp = comps[i];
    bfs(graph, comp[0], (v, c) => {
      if (c >= 0 && v != c) order.push(v);
    });
  }
  return order;
};
