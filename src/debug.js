reorder.displaymat = function(mat, rowperm, colperm) {
    var i, j, row, col, str;
    if (! rowperm) {
	rowperm = reorder.range(mat.length);
    }
    if (! colperm) {
	colperm = reorder.range(mat[0].length);
    }
    console.log('Matrix:');
    for (i = 0; i < mat.length; i++) {
	row = rowperm ? mat[rowperm[i]] : mat[i];
	str = "";
	for (j = 0; j < row.length; j++) {
	    col = colperm ? row[colperm[j]] : row[j];
	    str += col ? '*' : ' ';
	}
	console.log(str);
    }
};

reorder.printmat = function(m, prec) {
    var i, j, row, line;
    if (! prec) prec=4;
    for (i = 0; i < m.length; i++) {
	row = m[i];
	line = "";
	for (j = 0; j < row.length; j++) {
	    if (line.length !== 0)
		line += ", ";
	    line += row[j].toFixed(prec);
	}
	console.log(i+": "+line);
    }
};

reorder.assert = function(v, msg) {
    if (! v) {
	console.log(msg);
	throw msg || "Assertion failed";
    }
};

reorder.printhcluster = function(cluster,indent) {
    if (cluster.left === null) 
	return  Array(indent+1).join(' ')+"id: "+cluster.id;

    return Array(indent+1).join(' ')
	+"id: "+cluster.id+", dist: "+cluster.dist+"\n"
	+reorder.printhcluster(cluster.left, indent+1)+"\n"
	+reorder.printhcluster(cluster.right, indent+1);
};
