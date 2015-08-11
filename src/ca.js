//Corresponence Analysis
// see http://en.wikipedia.org/wiki/Correspondence_analysis

function sumrows(v) {
    var n = v.length,
	o = v[0].length,
	sumrow = Array(n),
	i, j, row, s;

    for (i = 0; i < n; i++) {
	row = v[i];
	s = 0;
	for (j = 0; j < o; j++) 
	    s += row[j];
	sumrow[i] = s;
    }
    return sumrow;
}

function sumcols(v) {
    var n = v.length,
	o = v[0].length,
	sumcol = reorder.zeroes(o),
	i, j, row;

    for (i = 0; i < n; i++) {
	row = v[i];
	for (j = 0; j < o; j++)
	    sumcol[j] += row[j];
    }
    return sumcol;
}

// Implementation of the decorana fortran code
// See Hill, M. O. 1979. DECORANA - A FORTRAN program for detrended
// correspondence analysis an reciprocal averaging. Cornell University,
// Ithaca, New York. 
// And
// Hill, M. O. 1973. Reciprocal averaging: an eigenvector method of
// ordination. J. Ecol. 61:237-49
// The Fortan implementation is available in the "vegan" R package:
// https://cran.r-project.org/web/packages/vegan/index.html

function decorana(dat) {
    var ZEROEIG = 1e-7, // consider as zero eigenvalue
	x, y, aidot, adotj, mi, n, s1,
	nr = dat.length,
	nc = dat[0].length;
    
    adotj = sumcols(dat);
    aidot = sumrows(dat);
    //console.log('adotj='); reorder.printvec(adotj);
    //console.log('aidot='); reorder.printvec(aidot);

    s1 = eigy(reorder.array1d(nr, 1.0),
	      reorder.array1d(nc, 1.0),
	      nr, nc, dat, aidot, adotj);
    if (s1.eig < ZEROEIG) {
        s1.rows = s1.cols = [];
	s1.eig = 0;
    }
    else {
	x = s1.rows;
	y = s1.cols;
	yxmult(y, x, nr, nc, dat);
	for (var i = 0; i < nr; i++)
	    x[i] /= aidot[i];
    }
    return s1;
}

function trans(y, yy, x, aidot, mi, n, dat,prt) {
    var i, j, a1;
    if (prt) console.log('TRANS '+prt);
    yxmult(y,x,mi,n,dat,prt);
    for (i = 0; i < mi; i++) {
	x[i] = x[i]/aidot[i]; // 10
    }
    // 100
    // a1 = 0.0;
    // for (i = 0; i < mi; i++) 
    // 	a1 += aidot[i]*x[i]; // 110
    // for (i = 0; i < mi; i++)
    // 	x[i] -= a1; // 120
    // 200
    xymult(x,yy,mi,n, dat,prt);
}

function printvec(y) {
    console.log('');
    for (var i = 0; i < y.length; i++) {
	console.log('i:'+(i+1)+' v:  '+y[i].toFixed(5));
    }
}

function xymult(x, y, mi, n, dat, prt) {
    var i, j, ax, row;

    if (prt) {
	console.log('xymult');
	printvec(y,5, null, 'y=');
    }
    for (j = 0; j < n; j++)
	y[j] = 0.0; // 10
    for (i = 0; i < mi; i++) {
	ax = x[i];
	row = dat[i];
	for (j = 0; j < n; j++) 
	    y[j] += ax*row[j]; // 20
    }
    if (prt) {
	//console.log('xymult[1]=');
	printvec(y,5, null, 'y=');
    }
}

function yxmult(y,x,mi,n,dat,prt) {
    var i, j, ax, row;
    if (prt) {
	console.log('yxmult');
	printvec(x,5, null, 'x=');
    }
    for (i = 0; i < mi; i++) {
	ax = 0.0;
	row = dat[i];
	for (j = 0; j < n; j++) {
	    ax += y[j]*row[j]; // 10
	}
	x[i] = ax; // 20
    }
    if (prt) {
	//console.log('yxmult[1]='); 
	printvec(x,5, null, 'x=');
    }
}

function eigy(x, y, mi, n, dat, aidot, adotj) {
    var i, j, tot, icount, a, ay, ex,
	a11, a12, a22, a23, a33, a34, a44, 
	res, ax1, ax2, ax3, ax4,
	b13, b14, b24, row,
	y2 = reorder.zeroes(n),
	y3 = reorder.zeroes(n),
	y4 = reorder.zeroes(n),
	y5 = reorder.zeroes(n),
	tol;

    tot = 0.0;
    for (j = 0; j < n; j++) {
	tot += adotj[j];
	y[j] = j+1.0; // 10
    }
    y[0] = 1.1;
    tol=0.000005;
    trans(y,y,x,aidot,mi,n,dat);//,1);
    icount = 0;
    while(true) {
	// 20
	a = 0.0;
	for (j = 0; j < n; j++)
	    a += y[j]*adotj[j]; // 30
	a /= tot;
	ex = 0.0;
	for (j = 0; j < n; j++) {
	    ay = y[j]-a;
	    ex += ay*ay*adotj[j];
	    y[j] = ay; // 40
	}
	ex = Math.sqrt(ex);
	for (j = 0; j < n; j++)
	    y[j] /= ex; // 50
	trans(y,y2,x,aidot,mi,n,dat);//,2);
	a=0.0;
	a11=0.0;
	a12=0.0;
	a22=0.0;
	a23=0.0;
	a33=0.0;
	a34=0.0;
	a44=0.0;
	for (j = 0; j < n; j++) {
	    ay = y2[j];
	    y2[j] = ay/adotj[j];
	    a += ay;
	    a11 += ay*y[j]; // 60
	}
	a /= tot;
	for (j = 0; j < n; j++) {
	    ay = y2[j]-(a+a11*y[j]);
	    a12 += ay*ay*adotj[j];
	    y2[j] = ay; // 70
	}
	a12 = Math.sqrt(a12);
	for (j = 0; j < n; j++)
	    y2[j] /= a12; // 80
	if (a12 < tol || icount > 999)
	    break;
	icount++;
	trans(y2,y3,x,aidot,mi,n,dat);//,3);
	a = 0.0;
	b13 = 0.0;
	for (j = 0; j < n; j++) {
	    ay = y3[j];
	    y3[j] = ay/adotj[j];
	    a += ay;
	    a22 +=ay*y2[j];
	    b13 += ay*y[j]; // 90
	}
	a /= tot;
	for (j = 0; j < n; j++) {
	    ay = y3[j]-(a+a22*y2[j]+b13*y[j]);
	    a23 += ay*ay*adotj[j];
	    y3[j]=ay; // 100
	}
	a23=Math.sqrt(a23);
	if (a23 > tol) {
	    // 105
	    for (j = 0; j < n; j++) {
		y3[j] /= a23; // 110
	    }
	    trans(y3,y4,x,aidot,mi,n,dat);//,4);
	    a = 0.0;
	    b14 = 0.0;
	    b24 = 0.0;
	    for (j = 0; j < n; j++) {
		ay = y4[j];
		y4[j] /= adotj[j];
		a += ay;
		a33 += ay*y3[j];
		b14 += ay*y[j];
		b24 += ay*y2[j]; // 120
	    }
	    a /= tot;
	    for (j = 0; j < n; j++) {
		ay = y4[j]-(a+a33*y3[j]+b14*y[j]+b24*y2[j]);
		a34 += ay*ay*adotj[j];
		y4[j] = ay; // 130
	    }
	    a34=Math.sqrt(a34);
	    if(a34 > tol) {
		// 135
		for (j = 0; j < n; j++)
		    y4[j] /= a34; // 140
		trans(y4,y5,x,aidot,mi,n,dat);//,5);
		for (j = 0; j < n; j++)
		    a44 += y4[j]*y5[j]; // 150
	    }
	    else {
		a34=0.0;
	    }
	}
	else {
	    a23 = 0.0;
	}
	// 160
	res = solve_tridiag(tol, a11, a12, a22, a23, a33, a34, a44);
	ax1 = res[0]; ax2 = res[1]; ax3 = res[2]; ax4 =res[3];
	// console.log('i '+icount+
	// 	    ' ax1 '+ax1.toFixed(6)+
	// 	    ' ax2 '+ax2.toFixed(6)+
	// 	    ' ax3 '+ax3.toFixed(6)+
	// 	    ' ax4 '+ax4.toFixed(6));

	// 180
	if(a12 < tol) break;
	for (j = 0; j < n; j++)
	    y[j]= ax1*y[j]+ax2*y2[j]+ax3*y3[j]+ax4*y4[j]; // 190
	// goto 20
    }
    // 200
    //console.log('eigenvalue',a11.toFixed(6));
    if (a12 > tol && reorder.debug > 0) {
	console.log("residual bigger than tolerance on axis 1");
    }
    var aymax = y[0],
	aymin = y[0],
	sign = 1;
    for (j = 1; j < n; j++) {
	a = y[j];
	if (a < aymin)
	    aymin = a;
	else if (a > aymax)
	    aymax = a;
    }
    if (-aymin > aymax) {
	for (j = 0; j < n; j++) // 210
	    y[j] = -y[j];
    }
    yxmult(y,x,mi,n,dat);//,true);
    for (i = 0; i < mi; i++)
	x[i] /= aidot[i]; // 220
    // 225
    var axlong = 0.0;
    for (i = 0; i < mi; i++)
	axlong += aidot[i]*sqr(x[i]); // 230
    axlong = Math.sqrt(axlong);
    for (i = 0; i < mi; i++)
	x[i] /= axlong; // 240
    for (j = 0; j < n; j++)
	y[j] /= axlong; // 250
    var sumsq=0.0,
	ax;
    for (i = 0; i < mi; i++) {
	ax = x[i];
	row = dat[i];
	for (j = 0; j < n; j++) {
	    sumsq += row[j]*sqr(ax-y[j]); // 255
	}
	// 260
    }
    var sd = Math.sqrt(sumsq/tot);
    if (a11 >= 0.999) {
	sd = aymax/axlong;
	var sd1 = -aymin/axlong;
	if (sd1 > sd)
	    sd = sd1;
    }
    // 265
    for (j = 0; j < n; j++)
	y[j] /= sd; // 270
    
    //printvec(x);
    //printvec(y);
    return {rows: x, cols: y, eig: a11};
}

function sqr(x) { return x*x; }

function solve_tridiag(tol, a11, a12, a22, a23, a33, a34, a44) {
    var ax1=1.0, // 160
	ax2=0.1,
	ax3=0.01,
	ax4=0.001,
	itimes,
	axx1, axx2, axx3, axx4, ex, exx, resi;
    //console.log('a11:'+a11+' a12:'+a12+' a22:'+a22);
    //console.log('a23:'+a23+' a33:'+a33+' a34:'+a34+' a44:'+a44);
    for (itimes = 0; itimes < 100; itimes++) {
	axx1=a11*ax1+a12*ax2;
	axx2=a12*ax1+a22*ax2+a23*ax3;
	axx3=a23*ax2+a33*ax3+a34*ax4;
	axx4=a34*ax3+a44*ax4;
	ax1=a11*axx1+a12*axx2;
	ax2=a12*axx1+a22*axx2+a23*axx3;
	ax3=a23*axx2+a33*axx3+a34*axx4;
	ax4=a34*axx3+a44*axx4;
	ex=Math.sqrt(sqr(ax1)+sqr(ax2)+sqr(ax3)+sqr(ax4));
	ax1=ax1/ex;
	ax2=ax2/ex;
	ax3=ax3/ex;
	ax4=ax4/ex;
	if((itimes+1)%5 === 0) {
	    exx=Math.sqrt(ex);
	    resi=Math.sqrt(sqr(ax1-axx1/exx)+sqr(ax2-axx2/exx)+
			   sqr(ax3-axx3/exx)+sqr(ax4-axx4/exx));
	}
	if (resi < tol*0.05)
	    break;
	// 170
    }
    // 180
    return [ax1, ax2, ax3, ax4];
}

reorder.ca_decorana = decorana;
reorder.ca = decorana;

reorder.ca_order = function(dat) {
    var res = reorder.ca(dat);
    return { rows: reorder.sort_order(res.rows),
	     cols: reorder.sort_order(res.cols),
	     details: res };
};
