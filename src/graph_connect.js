export function graph_connect(graph, comps) {
  const links = graph.links();

  if (!comps) comps = graph.components();

  for (let i = 0; i < comps.length - 1; i++) {
    for (let j = i + 1; j < comps.length; j++) {
      links.push({ source: comps[i][0], target: comps[j][0] });
    }
  }
  graph.links(links);
  return graph.init();
}
