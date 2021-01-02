import { debug } from './core';
import { cmp_number } from './utils';

export function graph(nodes, links, directed) {
  const graph = {};
  let linkDistance = 1;
  let edges;
  let inEdges;
  let outEdges;
  let components;

  graph.nodes = function (x) {
    if (!arguments.length) return nodes;
    nodes = x;
    return graph;
  };

  graph.nodes_indices = () => nodes.map((n) => n.index);

  graph.generate_nodes = (n) => {
    nodes = [];
    for (let i = 0; i < n; i++) nodes.push({ id: i });
    return graph;
  };

  graph.links = function (x) {
    if (!arguments.length) return links;
    links = x;
    return graph;
  };
  graph.links_indices = () =>
    links.map((l) => ({
      source: l.source.index,
      target: l.target.index,
    }));
  graph.linkDistance = function (x) {
    if (!arguments.length) return linkDistance;
    linkDistance = typeof x === 'function' ? x : +x;
    return graph;
  };

  graph.directed = function (x) {
    if (!arguments.length) return directed;
    directed = x;
    return graph;
  };

  function init() {
    let i;
    let o;
    const n = nodes.length;
    const m = links.length;

    components = undefined;
    for (i = 0; i < n; ++i) {
      (o = nodes[i]).index = i;
      o.weight = 0;
    }

    for (i = 0; i < m; ++i) {
      (o = links[i]).index = i;
      if (typeof o.source == 'number') o.source = nodes[o.source];
      if (typeof o.target == 'number') o.target = nodes[o.target];
      if (!('value' in o)) o.value = 1;
      ++o.source.weight;
      ++o.target.weight;
    }

    if (typeof linkDistance === 'function')
      for (i = 0; i < m; ++i)
        links[i].distance = +linkDistance.call(this, links[i], i);
    else for (i = 0; i < m; ++i) links[i].distance = linkDistance;

    edges = Array(nodes.length);
    for (i = 0; i < nodes.length; ++i) {
      edges[i] = [];
    }

    if (directed) {
      inEdges = Array(nodes.length);
      outEdges = Array(nodes.length);
      for (i = 0; i < nodes.length; ++i) {
        inEdges[i] = [];
        outEdges[i] = [];
      }
    } else {
      inEdges = outEdges = edges;
    }

    for (i = 0; i < links.length; ++i) {
      o = links[i];
      edges[o.source.index].push(o);
      if (o.source.index != o.target.index) edges[o.target.index].push(o);
      if (directed) inEdges[o.source.index].push(o);
      if (directed) outEdges[o.target.index].push(o);
    }

    return graph;
  }

  graph.init = init;

  graph.edges = (node) => {
    if (typeof node != 'number') {
      node = node.index;
      if (debug) {
        console.log('received node %d', node);
      }
    }
    return edges[node];
  };

  graph.degree = (node) => {
    if (typeof node != 'number') node = node.index;
    return edges[node].length;
  };

  graph.inEdges = (node) => {
    if (typeof node != 'number') node = node.index;
    return inEdges[node];
  };

  graph.inDegree = (node) => {
    if (typeof node != 'number') node = node.index;
    return inEdges[node].length;
  };

  graph.outEdges = (node) => {
    if (typeof node != 'number') node = node.index;
    return outEdges[node];
  };

  graph.outDegree = (node) => {
    if (typeof node != 'number') node = node.index;
    return outEdges[node].length;
  };

  graph.sinks = () => {
    const sinks = [];
    let i;

    for (i = 0; i < nodes.length; i++) {
      if (graph.outEdges(i).length === 0) sinks.push(i);
    }
    return sinks;
  };

  graph.sources = () => {
    const sources = [];
    let i;

    for (i = 0; i < nodes.length; i++) {
      if (graph.inEdges(i).length === 0) sources.push(i);
    }
    return sources;
  };

  function distance(i) {
    return links[i].distance;
  }
  graph.distance = distance;

  function neighbors(node) {
    const e = edges[node],
      ret = [];
    for (let i = 0; i < e.length; ++i) {
      const o = e[i];
      if (o.source.index == node) ret.push(o.target);
      else ret.push(o.source);
    }
    return ret;
  }
  graph.neighbors = neighbors;

  graph.other = (o, node) => {
    if (typeof o == 'number') o = links[o];
    if (o.source.index == node) return o.target;
    else return o.source;
  };

  function compute_components() {
    const stack = [];
    let comp = 0;
    const comps = [];
    let ccomp;
    const n = nodes.length;
    let i;
    let j;
    let v;
    let l;
    let o;
    let e;

    for (i = 0; i < n; i++) nodes[i].comp = 0;

    for (j = 0; j < n; j++) {
      if (nodes[j].comp !== 0) continue;
      comp = comp + 1; // next connected component
      nodes[j].comp = comp;
      stack.push(j);
      ccomp = [j]; // current connected component list

      while (stack.length) {
        v = stack.shift();
        l = edges[v];
        for (i = 0; i < l.length; i++) {
          e = l[i];
          o = e.source;
          if (o.index == v) o = e.target;
          if (o.index == v)
            // loop
            continue;
          if (o.comp === 0) {
            o.comp = comp;
            ccomp.push(o.index);
            stack.push(o.index);
          }
        }
      }
      if (ccomp.length) {
        ccomp.sort(cmp_number);
        comps.push(ccomp);
      }
    }
    comps.sort((a, b) => b.length - a.length);
    return comps;
  }

  graph.components = () => {
    if (!components) components = compute_components();
    return components;
  };

  return graph;
}
