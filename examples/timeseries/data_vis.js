var matrices_vis = [];
var col_labels_vis = [];
var row_labels_vis = [];

var margin = {top: 30, right: 0, bottom: 10, left: 30},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

function load_vis(callback){

d3.csv("IEEE VIS papers 1990-2020.csv", function(err,data) {
    var map = {};
    var countings = {};
    var firstIndex = 2594 - 2;
    var firstYear = 2015;
    for (var i = firstIndex; i < data.length; i++) {
            var names = data[i]["AuthorNames-Deduped"].split(";");
            if(data[i].Conference === "InfoVis"){
                for (var j = 0; j < names.length; j++) {
                    if(!(names[j] in countings)){
                            countings[names[j]] = [1,data[i].Year];
                    }
                    else if(countings[names[j]][1] !== data[i].Year){
                        
                        countings[names[j]][0] = countings[names[j]][0] + 1; 
                        countings[names[j]][1] = data[i].Year; 
                    }
                }
            }
   }
   for (var i = firstIndex; i < data.length; i++) {
            var names = data[i]["AuthorNames-Deduped"].split(";");
            var affiliations = data[i]["AuthorAffiliation"].split(";");
            var include = false;
            for (var j = 0; j < names.length; j++) {
                    if(data[i].Conference === "InfoVis" && countings[names[j]][0] >= 3){
                            include = true;
                    }
                }
            if(data[i].Conference === "InfoVis" && include){
                for (var j = 0; j < names.length; j++) {
                    if(!(names[j] in map)){
                            map[names[j]] = Object.keys(map).length;
                    }
                }
            }
   }
    const ordered = Object.keys(map).sort().reduce(
      (obj, key) => { 
        obj[key] = map[key]; 
        return obj;
      }, 
      {}
    );
    for (var i = 0; i <  Object.keys(ordered).length; i++) {
        ordered[Object.keys(ordered)[i]] = i;
        col_labels_vis.push(Object.keys(ordered)[i]);
        row_labels_vis.push(Object.keys(ordered)[i]);
    }
   for (var k = firstYear; k <= 2020; k++) {
        var matrix = [];
        for (var i = 0; i < Object.keys(map).length; i++) {
            var arr = [];
            for (var j = 0; j < Object.keys(map).length; j++) {
                arr.push(0);
            }
            matrix.push(arr);

        }
        matrices_vis.push(matrix);
   }
   var year = 0;
   for (var i = firstIndex; i < data.length; i++) {
       if(data[i].Year !== (year+firstYear).toString()){
           year++;
       }
       var names = data[i]["AuthorNames-Deduped"].split(";");
       for (var m = 0; m < names.length; m++) {
           for (var n = m+1; n < names.length; n++) {
                if(names[m] in map && names[n] in map){
                    matrices_vis[year][ordered[names[m]]][ordered[names[n]]] = 1;
                    matrices_vis[year][ordered[names[n]]][ordered[names[m]]] = 1;
                }
           }
       }
   }
  
   var tables_vis = [];
    for(let i = 0; i<matrices_vis.length; i++){
     var svg = d3.select("#heatmap").append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     var t1 = new table({matrix: matrices_vis[i], row_labels_vis: row_labels_vis, col_labels_vis: col_labels_vis},svg);
     tables_vis[i] = t1;
    }
    
    callback(matrices_vis, col_labels_vis, row_labels_vis, tables_vis);
    
});



}