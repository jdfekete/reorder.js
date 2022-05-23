/*
 * Linear arrangement 
 * The sum of: for each edge: the distance in the ordering between the endpoints
 * 
 * @matrix: a permuted matrix
 */
export function linear_arrangement(matrix) {
  let linarr = 0;
  for(let i = 0 ; i < matrix.length; i++){
    for(let j = 0 ; j <matrix[0].length ; j++){
        if(i!==j && matrix[i][j] > 0) {
            linarr += Math.abs(i-j);
        }
    }
  }
  return linarr;
}
