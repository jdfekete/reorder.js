function getDistance(matrix){
    let value = document.getElementById('distance').value;
    if(value === "morans"){
        return reorder.distance[value](matrix);
    }
    return reorder.distance[value];
}
function getTimestep(){
    let timestep = document.getElementById("timestep").value - 1;
    if(timestep < 0 || timestep >= matrices.length){
      document.getElementById("loading").innerHTML = "Timestep (x) is not valid for this dataset";
    }
    document.getElementById("loading").innerHTML = "";
    return timestep;
}
function computeQualities(t,time){
    let output = "";
    let bandwidth = [];
    let profile = [];
    let linarr = [];
    let moran = [];
    for(let i = 0; i<t.length; i++){
        let qualities = t[i].quality();
        bandwidth.push(qualities[0]);
        profile.push(qualities[1]);
        linarr.push(qualities[2]);
        moran.push(qualities[3]);
    }
    document.getElementById("qualitymean").innerHTML = "Mean<br>BW: " + d3.mean(bandwidth) + "<br>PR: " + d3.mean(profile) + "<br>LA: " + d3.mean(linarr)  + "<br>MI: " + d3.mean(moran)   + "<br>Time: " + time;
    document.getElementById("qualitymin").innerHTML = "Min<br>BW: " + d3.min(bandwidth) + "<br>PR: " + d3.min(profile) + "<br>LA: " + d3.min(linarr) + "<br>MI: " + d3.min(moran);
    document.getElementById("qualitymax").innerHTML = "Max<br>BW: " + d3.max(bandwidth) + "<br>PR: " + d3.max(profile) + "<br>LA: " + d3.max(linarr) + "<br>MI: " + d3.max(moran);
    document.getElementById("qualitymed").innerHTML = "Median<br>BW: " + d3.median(bandwidth) + "<br>PR: " + d3.median(profile) + "<br>LA: " + d3.median(linarr) + "<br>MI: " + d3.median(moran);
}

function initial_order_permute(t) {
    let row_perm = reorder.permutation(matrices[0].length),
        col_perm = reorder.permutation(matrices[0][0].length);
    for(let i = 0; i<t.length; i++){
      t[i].order(row_perm, col_perm);
    }
    computeQualities(t);
}

// Results in random symmetrical ordering (r1,r1 instead of r1,r2)
function random_permute(t) {
    let r1 = reorder.randomPermutation(matrices[0].length),
        r2 = reorder.randomPermutation(matrices[0][0].length);
    for(let i = 0; i<t.length; i++){
      t[i].order(r1,r1);
    }
    computeQualities(t);
}

function max_mi_gx(t) {
    let timestep = getTimestep();
    let start = new Date().getTime();
    
    let dist = reorder.dist();
    dist.distance(getDistance(matrices[timestep]));
    let dist_rows = dist(matrices[timestep]);
//      let transpose = reorder.transpose(matrices[timestep]),
//      dist_cols = reorder.dist()(transpose);
    let order = reorder.optimal_leaf_order(),
    row_perm = order.distanceMatrix(dist_rows)(matrices[timestep]);
//      let col_perm = order.distanceMatrix(dist_cols)(transpose);
    let end = new Date().getTime();
    let time = end - start;
    for(let i = 0; i<t.length; i++){
        t[i].order(row_perm, row_perm);
      }
    computeQualities(t,time);
}

function union_leaf_order_permute(t,square) {
    let start = new Date().getTime();
    let pile = reorder.union(matrices);
    let dist = reorder.dist();
    dist.distance(getDistance(pile));
    let dist_rows = dist(pile);
  //  let transpose = reorder.transpose(pile)
  //      dist_cols = reorder.dist()(transpose);

    let order = reorder.optimal_leaf_order();
    let row_perm = order.distanceMatrix(dist_rows)(matrices[0]);
  //let col_perm = order.distanceMatrix(dist_cols)(transpose);

    let end = new Date().getTime();
    let time = end - start;
    for(let i = 0; i<t.length; i++){
      t[i].order(row_perm, row_perm);
    }
    computeQualities(t,time);
      
}

function gx_leaf_order_permute(t) {
    let timestep = getTimestep();
    let start = new Date().getTime();
    let dist = reorder.dist();
    dist.distance(getDistance(matrices[timestep]));
    let dist_rows = dist(matrices[timestep]);
//      let transpose = reorder.transpose(matrices[timestep]),
//      dist_cols = reorder.dist()(transpose);
    let order = reorder.optimal_leaf_order(),
    row_perm = order.distanceMatrix(dist_rows)(matrices[timestep]);
//      let col_perm = order.distanceMatrix(dist_cols)(transpose);

    for(let i = 0; i<t.length; i++){
      t[i].order(row_perm, row_perm);
    }
    let end = new Date().getTime();
    let time = end - start;

    computeQualities(t,time);
      
}

function simultaneous_leaf_order_permute(t) {
    let start = new Date().getTime();
    let distances = [];
    for (let i = 0; i < t.length; i++) {
        distances.push(getDistance(matrices[i]));
    }
    let dist_rows = reorder.mult_dist()(matrices,distances);
    let order = reorder.optimal_leaf_order();
    let row_perm = order.distanceMatrix(dist_rows)(matrices[0]);
    
    let end = new Date().getTime();
    let time = end - start;
    for(let i = 0; i<t.length; i++){
      t[i].order(row_perm, row_perm);
    }
    computeQualities(t,time);
}

function gx_barycenter_permute(t) {
    let timestep = getTimestep();
    let nodes = [];
    let links = [];
    for(let i = 0; i < matrices[timestep].length; i++){
        nodes[i] = {"name": col_labels[i], "group" : 1};
    }

    for(let i = 0; i < matrices[timestep].length; i++){
        for(let j=0; j<matrices[timestep][0].length; j++){
            if(matrices[timestep][i][j] === 1){
                links.push({"source" : i, "target" : j, "value" : 1});
            }

        }
    }

    let graph = reorder.graph()
      .nodes(nodes)
      .links(links)
      .directed(false)
      .init();
    order = reorder.barycenter_order(graph);
    improved = reorder.adjacent_exchange(graph,
                                             order[0],
                                             order[1]);
    let row_perm = improved[0],
        col_perm = improved[1];

    for(let i = 0; i<t.length; i++){
      t[i].order(row_perm, col_perm);
    }
    computeQualities(t);
}

function union_barycenter_permute(t) {
    let start = new Date().getTime();
    let pile = reorder.union(matrices);

    let nodes = [];
    let links = [];
    for(let i = 0; i < pile.length; i++){
        nodes[i] = {"name": col_labels[i], "group" : 1};
    }

    for(let i = 0; i < pile.length; i++){
        for(let j=0; j<pile[0].length; j++){
            if(pile[i][j] !== 0){
                links.push({"source" : i, "target" : j, "value" : pile[i][j]});
            }

        }
    }

    let graph = reorder.graph()
      .nodes(nodes)
      .links(links)
      .init();
    order = reorder.barycenter_order(graph);
    improved = reorder.adjacent_exchange(graph,
                                             order[0],
                                             order[1]);
    let row_perm = improved[0],
        col_perm = improved[1];

    let end = new Date().getTime();
    let time = end - start;
    for(let i = 0; i<t.length; i++){
      t[i].order(row_perm, col_perm);
    }
    return computeQualities(t,time);
}

function simultaneous_barycenter_permute(t) {
    let start = new Date().getTime();
        
    let graphs = [];
    for(let k = 0; k<matrices.length; k++){
        let nodes = [];
        let links = [];
        for(let i = 0; i < matrices[0].length; i++){
            nodes[i] = {"name": col_labels[i], "group" : 1};
        }

        for(let i = 0; i < matrices[0].length; i++){
            for(let j=0; j<matrices[0][0].length; j++){
                if(matrices[k][i][j] === 1){
                    links.push({"source" : i, "target" : j, "value" : 1});
                }

            }
        }

        let graph = reorder.graph()
          .nodes(nodes)
          .links(links)
          .directed(false)
          .init();
        graphs[k] = graph;
    }
    let order = reorder.mult_barycenter_order(graphs);
    let improved = reorder.mult_adjacent_exchange(graphs,
                                             order[0],
                                             order[1]);
    let row_perm = improved[0],
        col_perm = improved[1];
      
    let end = new Date().getTime();
    let time = end - start;
    for(let i = 0; i<t.length; i++){
        t[i].order(row_perm, col_perm);
      }
    return computeQualities(t,time);
}