import { range } from './range';

export const permutation = range;

export function inverse_permutation(perm, dense) {
    var inv = dense ? Array(perm.length) : {};
    for (var i = 0; i < perm.length; i++) {
	inv[perm[i]] = i;
    }
    return inv;
}
