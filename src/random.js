reorder.random = function(n) {
    var permutation = [], i;
    
    for (i=0; i < n; i++)
	permutation.push(i);
    for (i=0; i<(n-1); i++) { 
	var random = Math.floor(Math.random()*(n-i))+i;
	if (random != i) {
	    var tmp = permutation[random];
	    permutation[random]=permutation[i]; 
	    permutation[i]=tmp;
	}
    }  
    return permutation;
};

