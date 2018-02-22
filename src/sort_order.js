reorder.sort_order = function(v) {
    return reorder.permutation(0, v.length).sort(
	function(a,b) { return v[a] - v[b]; });
};

reorder.sort_order_ascending = reorder.sort_order;

reorder.sort_order_descending = function(v) {
    return reorder.permutation(0, v.length).sort(
	function(a,b) { return v[b] - v[a]; });
};
