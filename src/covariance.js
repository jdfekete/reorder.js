import { dot } from './aliases';

export const covariance = dot;

export function covariancetranspose(v, a, b) {
    var n = v.length,
	cov = 0,
	i;
    for (i = 0; i < n; i++) {
	cov += v[i][a]*v[i][b];
    }
    return cov;
};

export function variancecovariance(v) {
    var o = v[0].length,
	cov = Array(o),
	i, j;

    for (i = 0; i < o; i++) {
	cov[i] = Array(o);
    }
    for (i = 0; i < o; i++) {
	for (j = i; j < o; j++)
	    cov[i][j] = cov[j][i] = covariancetranspose(v, i, j);
    }
    return cov;
};
