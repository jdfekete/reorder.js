// Use as: [4,3,2].sort(reorder.cmp_number_asc);
reorder.cmp_number_asc = function(a,b) { return a-b; };
reorder.cmp_number = reorder.cmp_number_asc;

// Use as: [4,3,2].sort(reorder.cmp_number_desc);
reorder.cmp_number_desc = function(a,b) { return b-a; };

// Use as: [[4,3],[2]].reduce(reorder.flaten);
reorder.flatten = function(a,b) { return a.concat(b); };

// Constructs a multi-dimensional array filled with Infinity.
reorder.infinities = function(n) {
    var i = -1,
	a = [];
    if (arguments.length === 1)
	while (++i < n)
	    a[i] = Infinity;
    else
	while (++i < n)
	    a[i] = reorder.infinities.apply(
		this, Array.prototype.slice.call(arguments, 1));
    return a;
};
