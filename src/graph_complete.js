import { graph } from './graph';
import { graph_empty_nodes } from './graph_empty';

export function complete_graph(n, directed) {
  const nodes = graph_empty_nodes(n);
  const links = [];

  if (directed) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i != j) links.push({ source: i, target: j });
      }
    }
  } else {
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) links.push({ source: i, target: j });
    }
  }
  return graph(nodes, links, directed).init();
}
