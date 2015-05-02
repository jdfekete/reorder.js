reorder.sort_order = function(v) {
    return reorder.range(0, v.length).sort(
	function(a,b) { return v[a] - v[b]; });
};
