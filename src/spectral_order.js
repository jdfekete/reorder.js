import { fiedler_vector } from './fiedler';
import { laplacian } from './laplacian';
import { sort_order } from './sort_order';
import { permute } from './permute';

export function spectral_order(graph, comps) {
  var i,
    vec,
    comp,
    perm,
    order = [];
  if (!comps) comps = graph.components();

  for (i = 0; i < comps.length; i++) {
    comp = comps[i];
    vec = fiedler_vector(laplacian(graph, comp));
    perm = sort_order(vec);
    order = order.concat(permute(comp, perm));
  }
  return order;
}
