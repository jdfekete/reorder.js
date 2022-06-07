class table{
    constructor(json,svg) {
        this.svg = svg;
        this.matrix = json.matrix;
	this.row_labels = json.row_labels;
	this.col_labels = json.col_labels;
	this.row_perm = json.row_permutation;
	this.col_perm = json.col_permutation;
	this.row_inv; 
        this.col_inv;
	this.n = this.matrix.length;
	this.m = this.matrix[0].length;
        
    if (! this.row_labels) {
	this.row_labels = Array(this.n);
	for (let i = 0; i < this.n; i++) 
	    this.row_labels[i] = i+1;
    }
    if (! this.col_labels) {
	this.col_labels = Array(this.m);
	for (let i = 0; i < this.n; i++) 
	    this.col_labels[i] = i+1;
    }

    if (! this.row_perm)
	this.row_perm = reorder.permutation(this.n);
    this.row_inv = reorder.inverse_permutation(this.row_perm);

    if (! this.col_perm)
	this.col_perm = reorder.permutation(this.m);
    this.col_inv = reorder.inverse_permutation(this.col_perm);

    var colorLow = 'white', colorHigh = 'black', colorGrid = 'grey';
    var max_value = d3.max(this.matrix.map(function(row) { return d3.max(row); })),
	color = d3.scale.linear()
	    .range([colorLow, colorHigh])
	    .domain([0, max_value]);

    var gridSize = Math.min(width / this.matrix.length, height / this.matrix[0].length);
	this.h = gridSize;
	this.th = this.h*this.n;
	this.w = gridSize;
	this.tw = this.w*this.m;

    var h = this.h;
    var row_inv = this.row_inv;
    var row = this.svg
	    .selectAll(".row")
	    .data(this.matrix, function(d, i) { return 'row'+i; })
	    .enter().append("g")
            .attr("id", function(d, i) { return "row"+i; })
            .attr("class", "row")
            .attr("transform", function(d, i) {
		return "translate(0,"+h*row_inv[i]+")";
	    });

    var w = this.w;
    var col_inv = this.col_inv;
    var cell = row.selectAll(".cell")
	    .data(function(d) { return d; })
	    .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function(d, i) { return w*col_inv[i]; })
            .attr("width", w)
            .attr("height", h)
            .style("fill", function(d) { return color(d); });

    row.append("line")
	.attr("x2", this.tw)
        .style("stroke", colorGrid);

    var row_labels = this.row_labels;
    row.append("text")
	.attr("x", Math.max(-10,-w/4))
	.attr("y", h / 2)
	.attr("dy", ".32em")
	.attr("text-anchor", "end")
        .attr("font-size",Math.min(25,h/2))
	.text(function(d, i) { return row_labels[i]; });

    var col = this.svg.selectAll(".col")
	    .data(this.matrix[0])
	    .enter().append("g")
	    .attr("id", function(d, i) { return "col"+i; })
	    .attr("class", "col")
	    .attr("transform", function(d, i) { return "translate(" + w*col_inv[i] + ")rotate(-90)"; });

    col.append("line")
	.attr("x1", -this.th)
        .style("stroke", colorGrid);

    var col_labels = this.col_labels;
    col.append("text")
	.attr("x", w/2)
	.attr("y", Math.max(-20,-h/2))
	.attr("dy", ".32em")
	.attr("text-anchor", "middle")
        .attr("transform", "rotate(90)")
        .attr("font-size", Math.min(25,h/2))
	.text(function(d, i) { return col_labels[i]; });

    svg.append("rect")
	.attr("width", this.tw)
	.attr("height", this.th)
	.style("fill", "none")
	.style("stroke", colorGrid);

   
}
    
    order(rows, cols) {
        var x = function(i){ return this.w*this.col_inv[i]; },
            y = function(i){ return this.h*this.row_inv[i]; };
	this.row_perm = rows;
	this.row_inv = reorder.inverse_permutation(this.row_perm);
	this.col_perm = cols;
	this.col_inv = reorder.inverse_permutation(this.col_perm);
	
	var t = this.svg.transition().duration(1000);
        var w = this.w,
            h = this.h,
            col_inv = this.col_inv,
            row_inv = this.row_inv;
	t.selectAll(".row")
            .attr("transform", function(d, i) {
		return "translate(0," + h*row_inv[i] + ")"; })
	    .selectAll(".cell")
            .attr("x", function(d, i) { return w*col_inv[i]; });

	t.selectAll(".col")
            .attr("transform", function(d, i) {
		return "translate(" + w*col_inv[i] + ")rotate(-90)"; });
    }
    
    quality(){
        let permuted = reorder.permute_matrix(this.matrix,this.row_perm,this.col_perm);
        let bandwidth = reorder.bandwidth_matrix(permuted);
        let profile = reorder.profile(permuted);
        let linarr = reorder.linear_arrangement(permuted);
        let moran = reorder.morans_i(permuted);
        
        return [bandwidth,profile,linarr,moran];
    }
    
}