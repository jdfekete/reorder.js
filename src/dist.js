reorder.dist = function() {
    var distance = science.stats.distance.euclidean;

    function dist(vectors) {
	var n = vectors.length,
            distMatrix = [];

	for (var i = 0; i < n; i++) {
	    distMatrix[i] = [];
	    for (var j = 0; j < n; j++) {
		if (i === j) {
		    distMatrix[i][j] = Infinity;
		}
		else if (j < i) {
		    distMatrix[i][j] = distMatrix[j][i];
		} 
		else {
		    distMatrix[i][j] = distance(vectors[i] , vectors[j]);
		}
	    }
	}
    };

    dist.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	return dist;
    };

    return dist;
};
