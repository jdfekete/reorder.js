import { graph_empty, graph_empty_nodes } from './graph_empty';
import { complete_graph } from './graph_complete';
import { graph } from './graph';

export function graph_random_erdos_renyi(n, p, directed) {
  if (p <= 0) return graph_empty(n, directed);
  else if (p >= 1) return complete_graph(n, directed);

  const nodes = graph_empty_nodes(n);
  const links = [];
  let v;
  let w;
  let lr;
  let lp;

  w = -1;
  lp = Math.log(1.0 - p);

  if (directed) {
    for (v = 0; v < n; ) {
      lr = Math.log(1.0 - Math.random());
      w = w + 1 + Math.floor(lr / lp);
      if (v == w) w = w + 1;
      while (w >= n && v < n) {
        w = w - n;
        v = v + 1;
        if (v == w) w = w + 1;
      }
      if (v < n) links.push({ source: v, target: w });
    }
  } else {
    for (v = 1; v < n; ) {
      lr = Math.log(1.0 - Math.random());
      w = w + 1 + Math.floor(lr / lp);
      while (w >= v && v < n) {
        w = w - v;
        v = v + 1;
      }
      if (v < n) links.push({ source: v, target: w });
    }
  }
  return graph(nodes, links, directed).init();
}

export const graph_random = graph_random_erdos_renyi;
