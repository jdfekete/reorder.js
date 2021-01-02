export function displaymat(mat, rowperm, colperm) {
  let i, j, row, col, str;
  console.log('Matrix:');
  for (i = 0; i < mat.length; i++) {
    row = rowperm ? mat[rowperm[i]] : mat[i];
    str = '';
    for (j = 0; j < row.length; j++) {
      col = colperm ? row[colperm[j]] : row[j];
      str += col ? '*' : ' ';
    }
    console.log(str);
  }
}

export function printvec(row, prec, colperm, line) {
  let j;
  if (!line) line = '';
  for (j = 0; j < row.length; j++) {
    if (line.length !== 0) line += ', ';
    if (colperm) line += row[colperm[j]].toFixed(prec);
    else line += row[j].toFixed(prec);
  }
  console.log(line);
}

export function printmat(m, prec, rowperm, colperm) {
  let row;
  if (!prec) prec = 4;
  for (let i = 0; i < m.length; i++) {
    row = rowperm ? m[rowperm[i]] : m[i];
    printvec(row, prec, colperm, `${i}: `);
  }
}

export function assert(v, msg) {
  if (!v) {
    console.log(msg);
    throw msg || 'Assertion failed';
  }
}

export function printhcluster(cluster, indent) {
  if (cluster.left === null)
    return `${Array(indent + 1).join(' ')}id: ${cluster.id}`;

  return `${Array(indent + 1).join(' ')}id: ${cluster.id}, dist: ${
    cluster.dist
  }\n${printhcluster(cluster.left, indent + 1)}\n${printhcluster(
    cluster.right,
    indent + 1
  )}`;
}
