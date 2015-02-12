reorder.permute = function(list, indexes) {
    var copy = list.slice(0);
    for (var i = 0; i < list.length; i++) 
	list[i] = copy[indexes[i]];
    return list;
};
