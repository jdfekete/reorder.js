function intersect_sorted_ints(array1, array2) 
{
  var ai = 0, bi= 0;
  var result = [];

  while( ai < a.length && bi < b.length ){
     if      (a[ai] < b[bi] ){ ai++; }
     else if (a[ai] > b[bi] ){ bi++; }
     else {  /* they're equal */
       result.push(ai);
       ai++;
       bi++;
     }
  }

  return result;
}
