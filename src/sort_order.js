import { permutation } from './permutation';

export function sort_order(v) {
  return permutation(0, v.length).sort((a, b) => v[a] - v[b]);
}

export const sort_order_ascending = sort_order;

export function sort_order_descending(v) {
  return permutation(0, v.length).sort((a, b) => v[b] - v[a]);
}
