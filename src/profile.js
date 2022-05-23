/*
 * Profile
 * The sum of: for each vertex u: the distance in the ordering to the smallest index vertex v, given the edge (u,v) exists
 * 
 * E.g. (column-based calculation, '-' are not used for profile calculation)
 *               PR =
 * [1,-,-,-,-,-] 0 +
 * [1,1,-,-,-,-] 1 +
 * [0,0,1,-,-,-] 0 +
 * [0,1,0,1,-,-] 2 +
 * [1,0,1,0,1,-] 4 +
 * [1,0,0,1,0,1] 5
 *                 = 12
 * 
 * WARNING: This is NOT a proper metric for DIRECTED graphs
 * 
 * @matrix: a permuted matrix
 */
export function profile(matrix) {
  let profile = 0;
  for(let i = 0 ; i < matrix.length; i++){
    let min = matrix.length ;
    for(let j = 0 ; j < matrix.length ; j++){
        if(matrix[i][j] > 0){
            if(j < min){
                min = j;
            }

        }
    }
    if(min < i){
        profile += i - min;
    }
  }
  return profile;
}
