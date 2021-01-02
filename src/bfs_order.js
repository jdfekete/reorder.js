import { bfs } from './bfs';

/*jshint loopfunc:true */
export const bfs_order = (graph, comps) => {
  if (!comps) {
    comps = graph.components();
  }

  const order = [];

  for (let i = 0; i < comps.length; i++) {
    const comp = comps[i];
    bfs(graph, comp[0], (v, c) => {
      if (c >= 0 && v != c) {
        order.push(v);
      }
    });
  }

  return order;
};
