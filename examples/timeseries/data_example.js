let matrices_example = [];
let col_labels_example = [];
let row_labels_example = [];

/* The example used for the teaser image of:
 * 
 * Simultaneous Matrix Orderings for Graph Collections.
 * Nathan van Beusekom, Wouter Meulemans, and Bettina Speckmann.
 * IEEE Transactions on Visualization and Computer Graphics, 28(1), pp 1-10, 2021.
 * https://arxiv.org/abs/2109.12050 
 */
function load_example(callback){

matrices_example = [
  [
    [1,1,1,1,0,0,0,0],
    [1,1,0,1,0,0,1,0],
    [1,0,1,1,0,0,0,0],
    [1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1],
    [0,0,0,0,1,1,1,1],
    [0,1,0,0,1,1,0,1],
    [0,0,0,0,1,1,1,1]]
, [
    [0,0,0,0,1,1,1,1],
    [0,1,1,0,1,1,1,1],
    [0,1,0,0,1,1,0,1],
    [0,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,0,0],
    [1,1,1,1,0,0,0,1],
    [1,1,0,1,0,0,0,0],
    [1,1,1,1,0,1,0,0]]
];
//matrices_example = [
//  [
//    [1,0,0,1,0,1,1,0],
//    [0,1,1,0,1,0,0,1],
//    [0,1,1,0,1,0,0,1],
//    [1,0,0,1,0,1,1,0],
//    [0,1,1,0,1,0,0,1],
//    [1,0,0,1,0,1,1,0],
//    [1,0,0,1,0,1,1,0],
//    [0,1,1,0,1,0,0,1]]
//, [
//    [0,1,1,0,1,0,0,1],
//    [1,0,0,1,0,1,1,0],
//    [1,0,0,1,0,1,1,0],
//    [0,1,1,0,1,0,0,1],
//    [1,0,0,1,0,1,1,0],
//    [0,1,1,0,1,0,0,1],
//    [0,1,1,0,1,0,0,1],
//    [1,0,0,1,0,1,1,0]]
//];
    const labels = [];
    for (let i = 0; i < matrices_example[0].length; i++) {
        labels.push(i);
    }
    col_labels_example = labels;
    row_labels_example = labels;
    const tables_example = [];
    for(let i = 0; i<matrices_example.length; i++){
        const svg = d3.select("#heatmap").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        const t1 = new table({matrix: matrices_example[i], row_labels_example: labels, col_labels_example: labels},svg);
        tables_example[i] = t1;
    }
    callback(matrices_example, col_labels_example, row_labels_example, tables_example);
}