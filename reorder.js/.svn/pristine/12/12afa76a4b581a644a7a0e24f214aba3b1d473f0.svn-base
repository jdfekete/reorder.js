reorder.range = function(start, stop, step) {
    if (arguments.length < 3) {
	step = 1;
	if (arguments.length < 2) {
	    stop = start;
	    start = 0;
	}
    }
    var range = [], i = start;
    if (step < 0)
	for (;i > stop; i += step)
	    range.push(i);
    else
	for (; i < stop; i += step)
	    range.push(i);
    return range;
};
