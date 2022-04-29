var matrices_sch = [];
var col_labels_sch = [];
var row_labels_sch = [];

var margin = {top: 30, right: 0, bottom: 10, left: 30},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

function load_sch(callback){

d3.csv("primaryschool.csv", function(err,data) {
    var indices = {};
    var count = 0;
    for (var i = 0; i < data.length; i++) {
            if(indices[data[i]['i']] === undefined){
                indices[data[i]['i']] = count;
                count++;
            }
            if(indices[data[i]['j']] === undefined){
                indices[data[i]['j']] = count;
                count++;
            }
    }
    var T = 31220;
    var matrix = []
    for (var i = 0; i < Object.keys(indices).length; i++) {
        var arr = [];
        for (var j = 0; j < Object.keys(indices).length; j++) {
            arr[j] = 0;
        }
        matrix[i] = arr;

    }
    for (var i = 0; i < data.length; i++) {
        if(parseInt(data[i]['t']) > T + 3600){
            matrices_sch.push(matrix);
            matrix = [];
            for (var k = 0; k < Object.keys(indices).length; k++) {
                var arr = [];
                for (var l = 0; l < Object.keys(indices).length; l++) {
                    arr[l] = 0;
                }
                matrix[k] = arr;

            }
            T = parseInt(data[i]['t']);
        }
        matrix[indices[data[i]['i']]][indices[data[i]['j']]] = 1;
        matrix[indices[data[i]['j']]][indices[data[i]['i']]] = 1;
    }
    var tables_sch = [];
    for(let i = 0; i<matrices_sch.length; i++){
     var svg = d3.select("#heatmap").append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     var t1 = new table({matrix: matrices_sch[i], row_labels_sch: row_labels_sch, col_labels_sch: col_labels_sch},svg);
     tables_sch[i] = t1;
    }
    
    callback(matrices_sch, col_labels_sch, row_labels_sch, tables_sch);
});
}