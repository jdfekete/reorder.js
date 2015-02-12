reorder.disttranspose = function() {
    var distance = reorder.distance.euclidean;

    function disttranspose(vectors) {
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
    };

    dist.distance = function(x) {
	if (!arguments.length) return distance;
	distance = x;
	return dist;
    };

    return dist;
};
