reorder.printmat = function(m) {
    var i, j, row, line;
    for (i = 0; i < m.length; i++) {
	row = m[i];
	line = "";
	for (j = 0; j < row.length; j++) {
	    if (line.length != 0)
		line += ", ";
	    line += row[j].toFixed(4);
	}
	console.log(i.toPrecision(3)+": "+line);
    }
};

reorder.assert = function(v, msg) {
    if (! v) {
	console.log(msg);
	throw msg || "Assertion failed";
    }
};

reorder.printhcluster = function(cluster,indent) {
    if (cluster.left == null) 
	return  Array(indent+1).join(' ')+"id: "+cluster.id;

    return Array(indent+1).join(' ')
	+"id: "+cluster.id+", dist: "+cluster.dist+"\n"
	+reorder.printhcluster(cluster.left, indent+1)+"\n"
	+reorder.printhcluster(cluster.right, indent+1);
};
