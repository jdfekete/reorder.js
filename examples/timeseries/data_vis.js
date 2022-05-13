let matrices_vis = [];
let col_labels_vis = [];
let row_labels_vis = [];

// Dataset from constructed from https://sites.google.com/site/vispubdata/home
// Co-authorship from authors who published in InfoVIS in the period 2015-2020
function load_vis(callback){

d3.csv("IEEE VIS papers 1990-2020.csv", function(err,data) {
    let map = {};
    let countings = {};
    let firstIndex = 2594 - 2;
    let firstYear = 2015;
    for (let i = firstIndex; i < data.length; i++) {
            let names = data[i]["AuthorNames-Deduped"].split(";");
            if(data[i].Conference === "InfoVis"){
                for (let j = 0; j < names.length; j++) {
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
   for (let i = firstIndex; i < data.length; i++) {
            let names = data[i]["AuthorNames-Deduped"].split(";");
            let affiliations = data[i]["AuthorAffiliation"].split(";");
            let include = false;
            for (let j = 0; j < names.length; j++) {
                    if(data[i].Conference === "InfoVis" && countings[names[j]][0] >= 3){
                            include = true;
                    }
                }
            if(data[i].Conference === "InfoVis" && include){
                for (let j = 0; j < names.length; j++) {
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
    for (let i = 0; i <  Object.keys(ordered).length; i++) {
        ordered[Object.keys(ordered)[i]] = i;
        col_labels_vis.push(Object.keys(ordered)[i]);
        row_labels_vis.push(Object.keys(ordered)[i]);
    }
   for (let k = firstYear; k <= 2020; k++) {
        let matrix = [];
        for (let i = 0; i < Object.keys(map).length; i++) {
            let arr = [];
            for (let j = 0; j < Object.keys(map).length; j++) {
                arr.push(0);
            }
            matrix.push(arr);

        }
        matrices_vis.push(matrix);
   }
   let year = 0;
   for (let i = firstIndex; i < data.length; i++) {
       if(data[i].Year !== (year+firstYear).toString()){
           year++;
       }
       let names = data[i]["AuthorNames-Deduped"].split(";");
       for (let m = 0; m < names.length; m++) {
           for (let n = m+1; n < names.length; n++) {
                if(names[m] in map && names[n] in map){
                    matrices_vis[year][ordered[names[m]]][ordered[names[n]]] = 1;
                    matrices_vis[year][ordered[names[n]]][ordered[names[m]]] = 1;
                }
           }
       }
   }
  
   let tables_vis = [];
    for(let i = 0; i<matrices_vis.length; i++){
     let svg = d3.select("#heatmap").append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     let t1 = new table({matrix: matrices_vis[i], row_labels_vis: row_labels_vis, col_labels_vis: col_labels_vis},svg);
     tables_vis[i] = t1;
    }
    
    callback(matrices_vis, col_labels_vis, row_labels_vis, tables_vis);
    
});



}