reorder.printmat = function(mat, rowperm, colperm) {
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
}
