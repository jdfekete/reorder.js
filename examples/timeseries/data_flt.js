var matrices_flt = [];
var col_labels_flt = [];
var row_labels_flt = [];

var margin = {top: 30, right: 0, bottom: 10, left: 30},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

function load_flt(callback){

var filename = "FlashTap_flashtap_1_graphdat_8.dyjson";
//var filename = "RC4101_1_graphdat_16.dyjson";
//var filename = "RC4103_1_graphdat_16.dyjson";
//var filename = "RC4201_1_graphdat_16.dyjson";
//var filename = "RC4204_1_graphdat_16.dyjson";
d3.json(filename, function(err,data){
    if(err) console.log("error fetching data: " + err);
    var size = data.times.length;
    for (var i = 0; i < size; i++) {
        var step = data.times[i].matrix;
        matrices_flt.push(step);


    }
    for (var k = 0; k < matrices_flt.length; k++) {
        for (var i = 0; i < matrices_flt[0].length; i++) {
            for (var j = 0; j < matrices_flt[0][0].length; j++) {
                if(matrices_flt[k][i][j] >= 0.5){
                    matrices_flt[k][i][j] = 1;
                }
                else{
                    matrices_flt[k][i][j] = 0;
                }


            }
        }
    }
    var labels = [];
    for (var i = 0; i < matrices_flt[0].length; i++) {
        labels.push(i);
    }
    col_labels_flt = labels;
    row_labels_flt = labels;
    var tables_flt = [];
    for(let i = 0; i<matrices_flt.length; i++){
    var svg = d3.select("#heatmap").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var t1 = new table({matrix: matrices_flt[i], row_labels_flt: labels, col_labels_flt: labels},svg);
    tables_flt[i] = t1;
    }
    
    callback(matrices_flt, col_labels_flt, row_labels_flt, tables_flt);
}); 
}