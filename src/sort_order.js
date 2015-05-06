reorder.sort_order = function(v) {
    return reorder.permutation(0, v.length).sort(
	function(a,b) { return v[a] - v[b]; });
};
