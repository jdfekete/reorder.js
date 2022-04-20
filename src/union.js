// Computes the union of a list of matrices
export function union(matrices) {
  let pile = [];
  for(let i = 0 ; i< matrices[0].length; i++){
      if(!pile[i]){
              pile.push([]);
      }
      for(let j = 0 ; j<matrices[0][0].length ; j++){
          if(!pile[i].length < matrices[0][0].length){
              pile[i].push(0);
          }
          for(let k = 0; k<matrices.length; k++){
              pile[i][j] = pile[i][j] + matrices[k][i][j];
          }
      }
  }
  return pile;
}
