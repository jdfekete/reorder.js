function spectral_order(graph, comps) {
    var i, vec, comp, perm, order = [];
    if (! comps)
	comps = graph.components();

    for (i = 0; i < comps.length; i++) {
	comp = comps[i];
	vec = reorder.fiedler_vector(reorder.laplacian(graph, comp));
	perm = reorder.sort_order(vec);
	order = order.concat(reorder.permute(comp, perm));
    }
    return order;
}

reorder.spectral_order = spectral_order;
