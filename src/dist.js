reorder.dist = function() {
    var distance = reorder.distance.euclidean;

    function dist(vectors) {
	var n = vectors.length,
            distMatrix = [];

	for (var i = 0; i < n; i++) {
	    var d = [];
	    distMatrix[i] = d;
	    for (var j = 0; j < n; j++) {
		if (j < i) {
		     d.push(distMatrix[j][i]);
		} 
		else if (i === j) {
		    d.push(0);
		}
		else {
		    d.push(distance(vectors[i] , vectors[j]));
		}
	    }
	}
	return distMatrix;
    }

    dist.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	return dist;
    };

    return dist;
};

reorder.distmax = function (distMatrix) {
    var max = 0,
	n=distMatrix.length,
	i, j, row;

    for (i = 0; i < n; i++) {
	row = distMatrix[i];
	for (j = i+1; j < n; j++)
	    if (row[j] > max)
		max = row[j];
    }
    return max;
};

reorder.distmin = function(distMatrix) {
    var min = Infinity,
	n=distMatrix.length,
	i, j, row;

    for (i = 0; i < n; i++) {
	row = distMatrix[i];
	for (j = i+1; j < n; j++)
	    if (row[j] < min)
		min = row[j];
    }
    return min;
};


reorder.dist_remove = function(dist, n, m) {
    if (arguments.length < 3)
	m = n+1;
    var i;
    dist.splice(n, m-n);
    for (i = dist.length; i-- > 0; )
	dist[i].splice(n, m-n);
    return dist;
};
