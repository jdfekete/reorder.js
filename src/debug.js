reorder.displaymat = function(mat, rowperm, colperm) {
    var i, j, row, col, str;
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

reorder.printvec = function(row, prec, colperm, line) {
    var j;
    if (! line)
	line = "";
    for (j = 0; j < row.length; j++) {
	if (line.length !== 0)
	    line += ", ";
	if (colperm)
	    line += row[colperm[j]].toFixed(prec);
	else
	    line += row[j].toFixed(prec);
    }
    console.log(line);
};

reorder.printmat = function(m, prec, rowperm, colperm) {
    var i, j, row, line;
    if (! prec) prec=4;
    for (i = 0; i < m.length; i++) {
	row = rowperm ? m[rowperm[i]] : m[i];
	reorder.printvec(row, prec, colperm, i+": ");
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
