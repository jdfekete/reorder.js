// Compute Moran's I of a permuted matrix using Rook's adjacency
export function morans_i(matrix) {
    // N is the number of cells, W is the number of adjacencies, mean is the mean value.
    var N = matrix.length * matrix.length;
    var W = (matrix.length-2) * (matrix.length-2) * 4 + (matrix.length-2) * 3 * 2 + (matrix.length-2) * 3 * 2 + 8;
    var m = 0;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[0].length; j++) {
            m += matrix[i][j];
        }
    }
    var mean = m/N;
    
    var num = 0, denom = 0;
    for (var j = 0; j < matrix.length; j++) {
        for (var i = 0; i < matrix[0].length; i++) {
            denom += Math.pow(matrix[j][i] - mean, 2);
            var innersum = 0;
            for (var y = Math.max(0,j-1); y < Math.min(matrix.length,j+2); y++) {
                for (var x = Math.max(0,i-1); x < Math.min(matrix[0].length,i+2); x++) {
                    if(y !== j || x !== i){
                        // Not Counting Diagonal Neighbours: Rook's adjacency (Recommended)
                        if(i - x >= -1 && i - x <= 1 && j === y){
                            innersum += (matrix[j][i] - mean) * (matrix[y][x] - mean);
                        }
                        if(i === x && j - y >= -1 && j - y <= 1){
                            innersum += (matrix[j][i] - mean) * (matrix[y][x] - mean);
                        }
                        
                        // Counting Diagonal Neighbours: Queen's adjacency 
                        // (When uncommenting this code, W should be adapted accordingly and the Rook's adjacency code should be commented)
                        /*
                        if(i - x >= -1 && i - x <= 1 && y - j >= -1 && y - j <= 1){
                            innersum += (matrix[j][i] - mean) * (matrix[y][x] - mean);
                        }
                        */
                    }
                }
            }
            num += innersum;
        }
    }
    
    // The case where every value is zero:
    if(num === 0 && denom === 0){
        return 1;
    }
    
    return (N/W) * (num/denom);
}
