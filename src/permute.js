reorder.permute = function(list, perm) {
    var m = perm.length;
    var copy = list.slice(0);
    while (m--)
	copy[m] = list[perm[m]];
    return copy;
};

reorder.permutetranspose = function(array, indexes) {
    var m = array.length;
    while (m-- > 0)
	array[m] = reorder.permute(array[m], indexes);
    return array;
};

