reorder.stablepermute = function(list, indexes) {
    var p = reorder.permute(list, indexes);
    if (p[0] > p[p.length-1]) {
	p.reverse();
    }
    return p;
};
