export function sort_order(v) {
    return reorder.permutation(0, v.length).sort(
	function(a,b) { return v[a] - v[b]; });
};

export const sort_order_ascending = sort_order;

export function sort_order_descending(v) {
    return reorder.permutation(0, v.length).sort(
	function(a,b) { return v[b] - v[a]; });
};
