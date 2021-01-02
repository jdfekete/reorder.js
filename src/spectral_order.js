import { fiedler_vector } from './fiedler';
import { laplacian } from './laplacian';
import { sort_order } from './sort_order';
import { permute } from './permute';

export function spectral_order(graph, comps) {
  let order = [];
  if (!comps) {
    comps = graph.components();
  }

  for (let i = 0; i < comps.length; i++) {
    const comp = comps[i];
    const vec = fiedler_vector(laplacian(graph, comp));
    const perm = sort_order(vec);
    order = order.concat(permute(comp, perm));
  }
  return order;
}
