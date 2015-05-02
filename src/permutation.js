reorder.permutation = reorder.range;


function inverse_permutation(perm, dense) {
    var inv = dense ? Array(perm.length) : {};
    for (var i = 0; i < perm.length; i++) {
	inv[perm[i]] = i;
    }
    return inv;
}

reorder.inverse_permutation = inverse_permutation;
