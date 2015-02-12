
reorder.heap = function(comp) {
    var heap = [], index = {}, Heap = {};

    Heap.length = function() { return heap.length; }
    Heap.insert = function(o) {
	var i = heap.length;
	heap.push(null);
	percolateUp(i, o);
    };

    Heap.isEmpty = function() { return heap.length == 0; };
    Heap.peek = function() {
	if (heap.length == 0)
	    throw {error: "Empty heap"};
	return heap[0];
    };

    Heap.pop = function() {
	if (heap.length == 0)
	    throw {error: "Empty heap"};
	var top = heap[0];
	if (top == null)
	    return top;

	var boto = heap[heap.length-1];
	heap[0] = boto;
	index[boto] = 0;

	heap.pop();
	if (heap.length > 1)
	    percolateDown(0);

	delete index[top];
	return top;
    };

    function lChild(i) { return i*2 + 1; };
    function rChild(i) { return i*2 + 2; };
    function parent(i) { return Math.floor((i-1)/2); };
    function swap(i, j) {
	var io = heap[i], jo = heap[j];
	heap[i] = jo;
	index[jo] = i;
	heap[j] = io;
	index[io] = j;
    };

    function update(o) {
	var i = percolateUp(index[o], o);
	percolateDown(i);
    };

    function percolateDown(cur) {
	while (true) {
	    var left = lChild(cur), right = rChild(cur);
	    var smallest;
	    if ((left < heap.length) && (comp(heap[left], heap[cur]) < 0))
		smallest = left;
	    else
		smallest = cur;

	    if ((right < heap.length) && (comp(heap[right], heap[smallest])) < 0)
		smallest = right;

	    if (cur == smallest) 
		return;
	    swap(cur, smallest);
	    cur = smallest;
	}
    };

    function percolateUp(cur, o) {
	var i = cur;

	for (par = parent(i);
	     (i > 0) && (comp(heap[par], o) > 0);
	     par = parent(par)) {
	    var p = heap[par];
	    heap[i] = p;
	    index[p] = i;
	    i = par;
	}
	heap[i] = o;
	index[o] = i;

	return i;
    };

    return Heap;
};
