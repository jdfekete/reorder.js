export function displaymat(mat, rowperm, colperm) {
  console.log('Matrix:');
  for (let i = 0; i < mat.length; i++) {
    const row = rowperm ? mat[rowperm[i]] : mat[i];
    let str = '';
    for (let j = 0; j < row.length; j++) {
      const col = colperm ? row[colperm[j]] : row[j];
      str += col ? '*' : ' ';
    }
    console.log(str);
  }
}

export function printvec(row, prec, colperm, line) {
  if (!line) {
    line = '';
  }
  for (let j = 0; j < row.length; j++) {
    if (line.length !== 0) {
      line += ', ';
    }
    if (colperm) {
      line += row[colperm[j]].toFixed(prec);
    } else {
      line += row[j].toFixed(prec);
    }
  }
  console.log(line);
}

export function printmat(m, prec, rowperm, colperm) {
  if (!prec) {
    prec = 4;
  }
  for (let i = 0; i < m.length; i++) {
    const row = rowperm ? m[rowperm[i]] : m[i];
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
  if (cluster.left === null) {
    return `${Array(indent + 1).join(' ')}id: ${cluster.id}`;
  }

  return `${Array(indent + 1).join(' ')}id: ${cluster.id}, dist: ${
    cluster.dist
  }\n${printhcluster(cluster.left, indent + 1)}\n${printhcluster(
    cluster.right,
    indent + 1
  )}`;
}
