var matrices_example = [];
var col_labels_example = [];
var row_labels_example = [];

var margin = {top: 30, right: 0, bottom: 10, left: 30},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
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
    for (var i = 0; i < matrices_example[0].length; i++) {
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
        console.log(t1);
        tables_example[i] = t1;
    }
    console.log(tables_example);
    callback(matrices_example, col_labels_example, row_labels_example, tables_example);
}