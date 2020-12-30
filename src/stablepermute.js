import { permute } from './permute';

export function stablepermute(list, indexes) {
    var p = permute(list, indexes);
    if (p[0] > p[p.length-1]) {
	p.reverse();
    }
    return p;
}
